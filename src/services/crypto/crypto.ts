import * as base64 from 'byte-base64'

import { hex } from '../../utils'

import { ContainerV1 } from './v1'
import { ContainerV2 } from './v2'
import { ContainerV3 } from './v3'
import { IContainer, ContainerFormat, ICryptoService, IDecryptionResult } from './interface'
import { ISecretContainer, Password, SecretContainerType } from './secret-container'

const encAlgorithm = 'AES-GCM'
const hashAlgorithm = 'SHA-256'
const keySaltLength = 16
const ivLength = 12
const deriveKeyOptions = { name: 'PBKDF2', iterations: 1, hash: 'SHA-256' }
const keyOptions = [
    { name: encAlgorithm, length: 256 }, // algorithm
    true, // extractable
    ['encrypt', 'decrypt'] // usage
] as [AesKeyGenParams, boolean, KeyUsage[]]

export class KeyContainer implements ISecretContainer {
    type: SecretContainerType = 'key'

    constructor(private key: CryptoKey, private _name: string) { }

    name(): string {
        return this._name
    }

    get() {
        return this.key
    }

    async serialize(): Promise<string> {
        const keyData = await window.crypto.subtle.exportKey('raw', this.key)
        const uint8Array = new Uint8Array(keyData)
        return base64.bytesToBase64(uint8Array)
    }

    static async parse(key: string): Promise<KeyContainer> {
        let keyBytes = base64.base64ToBytes(key)
        let name = await window.crypto.subtle.digest(hashAlgorithm, keyBytes)
                        .then(hash => hex(hash).substring(0, 8))

        const parsed = await window.crypto.subtle.importKey('raw', keyBytes, ...keyOptions)
        return new KeyContainer(parsed, name)
    }
}

export class CryptoService implements ICryptoService {
    async encrypt(data: string, secret: ISecretContainer, comment: string): Promise<IContainer> {
        const encoder = new TextEncoder()
        const dataBytes = encoder.encode(data)
        const iv = window.crypto.getRandomValues(new Uint8Array(ivLength))
        const salt = window.crypto.getRandomValues(new Uint8Array(keySaltLength))
        const hash = await window.crypto.subtle.digest(hashAlgorithm, dataBytes)
        const key = await this.getCryptoKey(secret, salt)

        const encrypted = await window.crypto.subtle.encrypt(
            { name: encAlgorithm, iv: iv }, key, dataBytes
        )

        const ivStr = base64.bytesToBase64(iv)
        const hashStr = base64.bytesToBase64(new Uint8Array(hash))
        const saltStr = base64.bytesToBase64(new Uint8Array(salt))
        const encryptedStr = base64.bytesToBase64(new Uint8Array(encrypted))

        const container = ContainerV3.create(encryptedStr, comment, hashStr, saltStr, ivStr)

        try {
            const result = await this.decryptV3(container, secret)
            if (result.result !== data) {
                throw new Error('unable to encrypt')
            }
        } catch (e) {
            console.log('encrypted, but unable to decrypt', e)
            throw e
        }

        return container
    }

    async decrypt(container: IContainer, secret: ISecretContainer): Promise<IDecryptionResult> {
        try {
            if (container instanceof ContainerV3) {
                return await this.decryptV3(container, secret)
            } else if (container instanceof ContainerV1 || container instanceof ContainerV2) {
                return await this.decryptOld(container, secret)
            } else {
                console.error(`unable to use this kind of container`)
                return {
                    error: "invalid_data",
                    result: ""
                }
            }
        } catch(e) {
            console.error('unable to decrypt data', e)
            return {
                error: "invalid_secret",
                result: ""
            }
        }
    }

    private decryptOld(container: ContainerV1 | ContainerV2, secret: ISecretContainer): IDecryptionResult {
        let password: string
        if (secret instanceof Password) {
            password = secret.get() as string
        } else {
            throw new Error(`unable to use secret ${secret.type} with container v${container.version}`)
        }

        const decrypted = container.decrypt(password)
        return {
            error: null,
            result: decrypted
        }
    }

    private async decryptV3(container: ContainerV3, secret: ISecretContainer): Promise<IDecryptionResult> {
        const decoder = new TextDecoder()
        const encrypted = base64.base64ToBytes(container.data)
        const iv = base64.base64ToBytes(container.iv).slice(0, ivLength)
        const salt = base64.base64ToBytes(container.salt).slice(0, keySaltLength)
        const key = await this.getCryptoKey(secret, salt)

        let decrypted: ArrayBuffer
        try {
            decrypted = await window.crypto.subtle.decrypt(
                { name: encAlgorithm, iv }, key, encrypted
            )
        } catch (e) {
            console.error('subtle error', e)
            return {
                error: 'invalid_secret',
                result: ''
            }
        }

        const newHash = await window.crypto.subtle.digest(hashAlgorithm, decrypted)
        const newHashStr = base64.bytesToBase64(new Uint8Array(newHash))
        if (newHashStr !== container.hash) {
            return {
                error: 'invalid_secret',
                result: ''
            }
        }

        return {
            error: null,
            result: decoder.decode(decrypted)
        }
    }

    parseContainer(data: string | ArrayBuffer, format?: ContainerFormat): IContainer | null {
        try {
            const obj = this.parseJson<{v: Number}>(data, format || 'base64')
            if (obj.v === 1) {
                return ContainerV1.parseObject(obj)
            } else if (obj.v === 2) {
                return ContainerV2.parseObject(obj)
            } else if (obj.v === 3) {
                return ContainerV3.parseObject(obj)
            } else {
                console.error(`unknown version ${obj.v}`)
                return null
            }
        } catch(e) {
            console.error('unable to parse data', e)
            return null
        }
    }

    private parseJson<T>(data: string | ArrayBuffer, format: ContainerFormat): T {
        const decoder = new TextDecoder()
        const data1 = data instanceof ArrayBuffer ? decoder.decode(data) : data
        if (format === 'json') {
            return JSON.parse(data1)
        } else if (format === 'base64') {
            return JSON.parse(base64.base64decode(data1))
        } else {
            throw new Error('unknown format ' + format)
        }
    }

    async generateKey(): Promise<ISecretContainer> {
        const key = await window.crypto.subtle.generateKey(...keyOptions)
        return new KeyContainer(key, '')
    }

    async importKey(key: string): Promise<ISecretContainer> {
        return KeyContainer.parse(key)
    } 

    private async getCryptoKey(secret: ISecretContainer, salt: BufferSource): Promise<CryptoKey> {
        if (secret instanceof KeyContainer) {
            return secret.get()
        } else if (secret instanceof Password) {
            return this.deriveKey(secret.get() as string, salt)
        } else {
            throw new Error(`unknown secret ${secret.type}`)
        }
    }

    private async deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
        const encoder = new TextEncoder()
        const passwordEncoded = encoder.encode(password)

        const passwordKey = await window.crypto.subtle.importKey(
            'raw',
            passwordEncoded,
            'PBKDF2',
            false,
            ['deriveKey']
        )

        return await window.crypto.subtle.deriveKey(
            { ...deriveKeyOptions, salt },
            passwordKey,
            ...keyOptions
        )
    }
}

import crypto from 'crypto-js'
import {Utf8} from '../utils'
import {IContainer, ContainerV1, ContainerV2} from './container'

export interface IDecryptionResult {
    error: string | null,
    result: string
}

export interface ICryptoService {
    encrypt(data: string, secret: string, comment: string): IContainer
    parse(data: string): IContainer | null
    decrypt(encrypted: string, secret: string): IDecryptionResult
}

export class CryptoService implements ICryptoService {
    encrypt(data: string, secret: string, comment: string): IContainer {
        const sensetiveWords = Utf8.parse(data) 
        const hash = crypto.enc.Base64.stringify(crypto.MD5(sensetiveWords))
        const encryptedStr = crypto.AES.encrypt(sensetiveWords, secret).toString()

        return ContainerV2.create(encryptedStr, comment, hash)
    }

    decrypt(encrypted: string, secret: string): IDecryptionResult {
        const container = this.parse(encrypted)
        if (container == null) {
            console.error(`unable to parse container`)
            return {
                error: "invalid_data",
                result: ""
            }
        }

        try {
            const decrypted = container.decrypt(secret)
            return {
                error: null,
                result: decrypted
            }
        } catch(e) {
            console.error('unable to decrypt data', e)
            return {
                error: "invalid_secret",
                result: ""
            }
        }
    }

    parse(data: string): IContainer  | null {
        try {
            const raw = ContainerV2.parseRaw(data)
            if (raw['v'] === 1) {
                return ContainerV1.parseObject(raw)
            } else if (raw['v'] === 2) {
                return ContainerV2.parseObject(raw)
            } else {
                console.error(`unknown version ${raw['v']}`)
                return null
            }
        } catch(e) {
            console.error('unable to parse data', e)
            return null
        }
    }
}

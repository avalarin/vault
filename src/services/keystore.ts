import { ICryptoService, DecryptionError, IDecryptionResult, Password, ParseAndDecryptUseCase, ISecretContainer } from './crypto'

export interface StoredKey {
    name: string,
    version: number,
    createdAt: Date,
}

export type ExtractError = DecryptionError | 'unknown'

export interface ExtractResult {
    error?: ExtractError | null,
    key?: ISecretContainer | null
}

export interface IKeystoreService {
    storeKey(name: string, key: string): Promise<StoredKey>
    getEncryptedKey(name: string): Promise<string | null>
    listKeys(): Promise<StoredKey[]>
    extractKey(name: string, password: string): Promise<ExtractResult | null>
}

export class BrowserKeystoreService implements IKeystoreService {
    private decrypt: ParseAndDecryptUseCase

    constructor(
        private crypto: ICryptoService
    ) {
        this.decrypt = new ParseAndDecryptUseCase(crypto)
    }

    async storeKey(name: string, key: string): Promise<StoredKey> {
        const keyobj = {
            name, version: 1, createdAt: new Date()
        }
        window.localStorage.setItem(`keystore_key_${name}`, key)
        this.appendToList(keyobj)
        return keyobj
    }

    async getEncryptedKey(name: string): Promise<string | null> {
        return window.localStorage.getItem(`keystore_key_${name}`)
    }

    async listKeys(): Promise<StoredKey[]> {
        return this.getList()
    }

    async extractKey(name: string, password: string): Promise<ExtractResult | null> {
        const key = window.localStorage.getItem(`keystore_key_${name}`)
        if (!key) return null

        let decrypt: IDecryptionResult
        try {
            decrypt = await this.decrypt.do({
                container: key,
                format: 'base64',
                secret: new Password(password)
            })
        } catch (e) {
            return {
                error: 'invalid_data',
                key: null
            }
        } 

        if (decrypt.error) {
            return {
                error: decrypt.error,
                key: null
            }
        }

        const importedkey = await this.crypto.importKey(decrypt.result)

        return {
            error: null,
            key: importedkey
        }
    }

    private getList(): StoredKey[] {
        const str = window.localStorage.getItem('keystore_list')
        if (!str) {
            window.localStorage.setItem('keystore_list', '[]')
            return []
        }
        return JSON.parse(str) as StoredKey[]
    }

    private appendToList(key: StoredKey): void {
        const str = window.localStorage.getItem('keystore_list')
        if (!str) {
            window.localStorage.setItem('keystore_list', JSON.stringify([key]))
            return
        }
        let list = JSON.parse(str) as StoredKey[]
        list = list.filter(l => l.name !== key.name)
        list.push(key)
        window.localStorage.setItem('keystore_list', JSON.stringify(list))
    }
}

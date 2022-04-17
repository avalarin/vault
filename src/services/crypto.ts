import crypto from 'crypto-js'

interface IPublicData {
    v: number,
    dt: number,
    comment: string,
    data: string
}

export interface IValidationResult {
    version: number,
    createdAt: Date,
    valid: boolean,
    comment: string
}

export interface IDecryptionResult {
    error: string | null,
    result: string
}

export interface ICryptoService {
    encryptToBase64(data: string, secret: string, comment: string): string
    validate(data: string): IValidationResult
    decryptFromBase64(encrypted: string, secret: string): IDecryptionResult
}

export class CryptoService implements ICryptoService {
    encryptToBase64(data: string, secret: string, comment: string): string {
        const metadata = {
            v: 1,
            dt: Date.now(),
            comment
        }

        const sensetiveWords = crypto.enc.Utf8.parse(
            JSON.stringify({
                ...metadata,
                data
            })
        ) 

        const encryptedStr = crypto.AES.encrypt(sensetiveWords, secret).toString()

        const publicStr = JSON.stringify({
            ...metadata,
            data: encryptedStr
        })

        return crypto.enc.Base64.stringify(
            crypto.enc.Utf8.parse(publicStr)
        )
    }

    validate(data: string): IValidationResult {
        const parsed = this.parse(data)
        if (parsed == null) {
            return {
                valid: false,
                version: 0,
                createdAt: new Date(0),
                comment: ""
            }
        }

        return {
            valid: true,
            version: parsed.v,
            createdAt: new Date(parsed.dt || 0),
            comment: parsed.comment
        }
    }

    decryptFromBase64(encrypted: string, secret: string): IDecryptionResult {
        const parsed = this.parse(encrypted)
        if (parsed == null) {
            return {
                error: "invalid_data",
                result: ""
            }
        }
        const decryptedStr = crypto.AES.decrypt(parsed.data, secret).toString(crypto.enc.Utf8)
        try {
            const decryptedObj = JSON.parse(decryptedStr)
            return {
                error: null,
                result: decryptedObj.data
            }
        } catch(e) {
            console.error('Unable to decrypt data', e)
            return {
                error: "invalid_secret",
                result: ""
            }
        }

    }

    private parse(data: string): IPublicData  | null {
        try {
            return JSON.parse(crypto.enc.Utf8.stringify(
                crypto.enc.Base64.parse(data)
            ))
        } catch(e) {
            console.error('Unable to parse data', e)
            return null
        }
    }
}

import crypto from 'crypto-js'
import { Utf8 } from '../../utils'
import { IContainer } from './interface'

export class ContainerV2 implements IContainer {
    public version: number = 2
    public valid: boolean = true

    constructor(
        public createdAt: Date,
        public comment: string,
        private data: string,
        private hash: string
    ) {}
    
    decrypt(secret: string): string {
        const decrypted = Utf8.stringify(crypto.AES.decrypt(this.data, secret))
        const hash = crypto.enc.Base64.stringify(crypto.MD5(decrypted))
        if (hash !== this.hash) {
            throw new Error(`decrypted data has incorrect hash`)
        }
        return decrypted
    }

    serialize(): string {
        const obj = {
            v: 2,
            dt: this.createdAt.getTime(),
            c: this.comment,
            d: this.data,
            h: this.hash
        }

        return crypto.enc.Base64.stringify(
            Utf8.parse(
                JSON.stringify(obj)
            )
        )
    }

    static create(encryptedStr: string, comment: string, hash: string): ContainerV2 {
        return new ContainerV2(new Date(), comment, encryptedStr, hash)
    }

    static parse(data: string): ContainerV2 {
        const obj = ContainerV2.parseRaw(data)
        return ContainerV2.parseObject(obj)
    }

    static parseRaw(data: string): any {
        return JSON.parse(Utf8.stringify(crypto.enc.Base64.parse(data)))
    }

    static parseObject(obj: any): ContainerV2 {
        return new ContainerV2(new Date(obj['dt'] as number), obj['c'], obj['d'], obj['h'])
    }
}

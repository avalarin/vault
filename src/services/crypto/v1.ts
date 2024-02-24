import crypto from 'crypto-js'
import { Utf8 } from '../../utils'
import { IContainer } from './interface'
import { ContainerV2 } from './v2'

export class ContainerV1 implements IContainer {
    public version: number = 1
    public valid: boolean = true

    constructor(
        public createdAt: Date,
        public comment: string,
        private data: string
    ) {}

    decrypt(secret: string): string {
        const decrypted = Utf8.stringify(crypto.AES.decrypt(this.data, secret))
        return JSON.parse(decrypted).data
    }

    serialize(): string {
        const obj = {
            v: 1,
            dt: this.createdAt.getTime(),
            comment: this.comment,
            data: this.data,
        }

        return crypto.enc.Base64.stringify(
            Utf8.parse(
                JSON.stringify(obj)
            )
        )
    }

    static parse(data: string): ContainerV1 {
        const obj = ContainerV2.parseRaw(data)
        return ContainerV1.parseObject(obj)
    }

    static parseObject(obj: any): ContainerV1 {
        return new ContainerV1(new Date(obj['dt'] as number), obj['comment'], obj['data'])
    }
}

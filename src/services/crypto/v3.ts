import * as base64 from 'byte-base64'

import { ContainerFormat, IContainer } from './interface'

export class ContainerV3 implements IContainer {
    public version: number = 3
    public valid: boolean = true

    constructor(
        public createdAt: Date,
        public comment: string,
        public data: string,
        public hash: string,
        public salt: string,
        public iv: string
    ) {}

    serialize(format?: ContainerFormat): string {
        const obj = {
            v: this.version,
            dt: this.createdAt.getTime(),
            c: this.comment,
            d: this.data,
            h: this.hash,
            s: this.salt,
            iv: this.iv
        }

        if (format === 'json') {
            return JSON.stringify(obj)
        }

        const encoder = new TextEncoder()
        return base64.bytesToBase64(encoder.encode(JSON.stringify(obj)))
    }

    static create(encryptedStr: string, comment: string, hash: string, salt: string, iv: string): ContainerV3 {
        return new ContainerV3(new Date(), comment, encryptedStr, hash, salt, iv)
    }

    static parse(data: string): ContainerV3 {
        const obj = ContainerV3.parseRaw(data)
        return ContainerV3.parseObject(obj)
    }

    private static parseRaw(data: string): any {
        const decoder = new TextDecoder()
        return JSON.parse(decoder.decode(base64.base64ToBytes(data)))
    }

    static parseObject(obj: any): ContainerV3 {
        return new ContainerV3(new Date(obj['dt'] as number), obj['c'], obj['d'], obj['h'], obj['s'], obj['iv'])
    }
}

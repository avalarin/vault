export interface IContainer {
    version: number,
    createdAt: Date,
    valid: boolean,
    comment: string

    decrypt(secret: string): string
    serialize(): string
}


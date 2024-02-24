export type SecretContainerType = 'password' | 'key'

export interface ISecretContainer {
    type: SecretContainerType
    name(): string
    get(): any
    serialize(): Promise<string>
}

export class Password implements ISecretContainer {
    type: SecretContainerType = 'password'

    constructor(
        private password: string
    ) {}

    name(): string {
        return 'password'
    }

    get(): string {
        return this.password
    }

    serialize(): Promise<string> {
        throw new Error('not applicable')
    }
}

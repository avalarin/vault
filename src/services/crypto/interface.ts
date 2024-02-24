import { ISecretContainer } from './secret-container'

export type DecryptionError = 'invalid_data' | 'invalid_secret' | 'item_not_found'

export interface IDecryptionResult {
    error: DecryptionError | null,
    result: string
}

export type ContainerFormat = 'json' | 'base64'

export interface ICryptoService {
    parseContainer(data: string | ArrayBuffer, format: ContainerFormat): IContainer | null

    encrypt(data: string, key: ISecretContainer, comment: string): Promise<IContainer>
    decrypt(container: IContainer, secret: ISecretContainer): Promise<IDecryptionResult>

    generateKey(): Promise<ISecretContainer>
    importKey(key: string): Promise<ISecretContainer>
}

export interface IContainer {
    version: number,
    createdAt: Date,
    valid: boolean,
    comment: string

    serialize(format?: ContainerFormat): string
}


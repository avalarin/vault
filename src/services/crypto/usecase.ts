import { ContainerFormat, ICryptoService, IDecryptionResult } from './interface'
import { ISecretContainer } from './secret-container'

export interface IParseAndDecryptReq {
    container: ArrayBuffer | string,
    format: ContainerFormat,
    secret: ISecretContainer
}

export class ParseAndDecryptUseCase {
    constructor(
        private crypto: ICryptoService
    ) {}

    async do(req: IParseAndDecryptReq): Promise<IDecryptionResult> {
        const container = this.crypto.parseContainer(req.container, req.format)
        if (!container) {
            return {
                error: 'invalid_data',
                result: ''
            }
        }

        return await this.crypto.decrypt(container, req.secret)
    }
}

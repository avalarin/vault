import { ICryptoService, IDecryptionResult, ISecretContainer } from '../crypto'
import { IProvider } from './interface'

export interface DownloadFileReq {
    fileId: string,
    secret: ISecretContainer
}

export interface EncryptAndUploadReq {
    path: string,
    name: string,
    data: string,
    secret: ISecretContainer
}

export class DownloadAndDecryptUseCase {
    constructor(
        private provider: IProvider,
        private crypto: ICryptoService
    ) { }

    async do(req: DownloadFileReq): Promise<IDecryptionResult> {
        const data = await this.provider.getData(req.fileId)
        if (!data) {
            return {
                error: 'item_not_found',
                result: ''
            }
        }
        const container = this.crypto.parseContainer(data, 'json')
        if (!container) {
            return {
                error: 'invalid_data',
                result: ''
            }
        }
        return this.crypto.decrypt(container, req.secret)
    }
}

export class EncryptAndUploadUseCase {
    constructor(
        private provider: IProvider,
        private crypto: ICryptoService
    ) { }

    async do(req: EncryptAndUploadReq): Promise<void> {
        const comment = `name: ${req.name}`
        const encoder = new TextEncoder()
        const container = await this.crypto.encrypt(req.data, req.secret, comment)
        this.provider.upload({
            path: req.path,
            name: req.name + '.vault.json',
            mime: 'application/vault+json',
        }, encoder.encode(container.serialize('json')))
    }
}

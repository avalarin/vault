import { IContainer } from './crypto/interface'
import { ConfigSource } from '../config'

export interface IUrlService {
    formUrl(container: IContainer): string
}

export class UrlService {
    constructor(private config: ConfigSource) {}

    formUrl(container: IContainer): string {
        const baseUrl = this.config().baseUrl
        const data = container.serialize()
        return `${baseUrl}/qr/decrypt?data=${data}`
    }
}

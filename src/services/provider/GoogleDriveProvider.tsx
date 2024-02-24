import { GoogleApiClient } from '../../utils/googleapi'
import {
    Entity, IProvider, AuthenticateResult,
    IProviderAuthenticator,
    AuthenticationMethod
} from './interface'

import { GoogleCompletePage } from './GoogleCompletePage'

const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

export interface IGoogleDriveProviderConfig {
    baseUrl: string,
    clientId: string
}

export class GoogleDriveProvider implements IProvider {
    name: string = 'Google Drive'
    private client: GoogleApiClient

    constructor(private config: IGoogleDriveProviderConfig) {
        this.client = new GoogleApiClient()
    }

    getAuthenticator(): IProviderAuthenticator {
        return this as IProviderAuthenticator
    }

    getAuthMethod(): AuthenticationMethod {
        return {
            method: 'redirect',
            type: 'google',
            url: 'https://accounts.google.com/o/oauth2/v2/auth',
            params: {
                client_id: this.config.clientId,
                redirect_uri: this.config.baseUrl + '/auth/complete_google',
                scope: scopes.join(' '),
                state: 'try_sample_request',
                include_granted_scopes: 'true',
                response_type: 'token'
            },
            completePage: () => <GoogleCompletePage redirectUrl='/storage' authenticator={this} />
        }
    }

    async authenticate(): Promise<AuthenticateResult> {
        const currentUserEmail = await this.client.getCurrentUserEmail()

        if (currentUserEmail) {
            return {
                authenticated: true,
                email: currentUserEmail,
                provider: this
            }
        }

        return { authenticated: false, provider: this }
    }

    async complete(token: string): Promise<AuthenticateResult> {
        this.client.setAccessToken(token)
        return this.authenticate()
    }

    async list(path: string): Promise<Entity[]> {
        return (await this.client.listFiles())
            .map(f => ({
                id: f.id,
                type: 'file',
                path: f.name,
                name: f.name,
                mime: f.mimeType,
                filetype: 'binary',
            }))
    }

    upload(entity: Entity, data: ArrayBuffer): Promise<void> {
        return this.client.uploadFile({
            name: entity.name,
            mimeType: entity.mime,
            data
        })
    }

    find(path: string): Promise<Entity | null> {
        throw new Error('Method not implemented.');
    }

    getData(fileId: string): Promise<ArrayBuffer | null> {
        return this.client.getFileContent({
            id: fileId
        })
    }

    delete(fileId: string): Promise<void> {
        return this.client.deleteFile({ id: fileId })
    }
}

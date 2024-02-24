import { IProviderAuthenticator, IProvider, AuthenticateResult, AuthenticationMethod } from './interface'
import { GoogleDriveProvider } from './GoogleDriveProvider'

import { ConfigSource } from '../../config'

export class ProvidersManager {
    private providers: IProvider[]
    private authenticators: IProviderAuthenticator[]

    constructor(configSource: ConfigSource) {
        const config = configSource()

        this.providers = [
            new GoogleDriveProvider({
                baseUrl: config.baseUrl,
                clientId: config.googleApi.clientId
            })
        ]

        this.authenticators = this.providers.map(p => p.getAuthenticator())
    }

    getProviders(): IProvider[] {
        return this.providers
    }

    getAuthenticators(): IProviderAuthenticator[] {
        return this.authenticators
    }

    getAllAuthMethods(): AuthenticationMethod[] {
        return this.authenticators.map(a => a.getAuthMethod())
    }

    async getAuthenticatedProvider(): Promise<AuthenticateResult | null> {
        for (let i = 0; i < this.providers.length; i++) {
            const provider = this.providers[i]
            const result = await provider.getAuthenticator().authenticate()
            if (result.authenticated) {
                return result
            }
        }
        return null
    }
}

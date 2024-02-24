import { ReactNode } from 'react'

export interface Entity {
    id: string
    type: EntityType
    path: string
    name: string
    mime: string
    filetype: FileType
}

export interface UploadHandle {
    current() :UploadStatus

    wait(): Promise<UploadStatus>
}

export interface UploadEntityReq {
    path: string
    name: string
    mime: string
}

export interface UploadStatus {
    completed: boolean
    error: string | null
    total: number
    uploaded: number
}

export type EntityType = 'file' | 'directory'
export type FileType = 'image' | 'text' | 'video' | 'binary'

export interface SuccessfulAuthenticationResult {
    authenticated: true
    provider: IProvider
    email: string
}

export interface AuthenticationRequiredResult {
    authenticated: false
    provider: IProvider
}

export interface AuthenticationMethodOptions {
    redirectUrl: string
}

export interface AuthenticationMethodRedirect {
    method: 'redirect'
    type: string
    url: string
    params: { [key: string]: string }
    completePage: () => ReactNode
}

export type AuthenticationMethod = AuthenticationMethodRedirect

export type AuthenticateResult = SuccessfulAuthenticationResult | AuthenticationRequiredResult

export interface IProvider {
    name: string

    getAuthenticator(): IProviderAuthenticator

    list(path: string): Promise<Entity[]>

    upload(req: UploadEntityReq, data: ArrayBuffer): Promise<void>

    find(path: string): Promise<Entity | null>

    getData(fileId: string): Promise<ArrayBuffer | null>

    delete(fileId: string): Promise<void>
}

export interface IProviderAuthenticator {
    getAuthMethod(): AuthenticationMethod

    authenticate(): Promise<AuthenticateResult>

    complete(token: string): Promise<AuthenticateResult>
}

import { PeopleMeResponse, FilesListResponse, File, UploadFileRequest, GetFileRequest, DeleteFileRequest } from './dto'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const ACCESSTOKEN_LSKEY = 'google_api_access_token'

export class GoogleApiClient {
    private accessToken: string = ''
    private axios: AxiosInstance

    constructor() {
        const accessToken = localStorage.getItem(ACCESSTOKEN_LSKEY)
        
        this.axios = axios.create()

        if (accessToken) {
            this.accessToken = accessToken
        }
    }

    async setAccessToken(token: string) {
        this.accessToken = token
        localStorage.setItem(ACCESSTOKEN_LSKEY, token)
    }

    async getCurrentUserEmail(): Promise<string | null> {
        try {
            const response = await this.request<PeopleMeResponse>({
                url: 'https://people.googleapis.com/v1/people/me',
                params: {
                    personFields: 'emailAddresses'
                }
            })

            return response.data.emailAddresses[0].value
        } catch (e) {
            console.log('google unauthenticated')
            return null
        }
    }

    async listFiles(): Promise<File[]> {
        const response = await this.request<FilesListResponse>({
            url: 'https://www.googleapis.com/drive/v3/files',
            data: { }
        })

        return response.data.files
    }

    async getFileContent(req: GetFileRequest): Promise<ArrayBuffer> {
        const response = await this.request<ArrayBuffer>({
            url: `https://www.googleapis.com/drive/v3/files/${req.id}?alt=media`,
            data: { },
            responseType: 'arraybuffer'
        })

        return response.data
    }

    async deleteFile(req: DeleteFileRequest): Promise<void> {
        await this.request({
            method: 'DELETE',
            url: `https://www.googleapis.com/drive/v3/files/${req.id}`
        })

        return
    }

    async uploadFile(req: UploadFileRequest): Promise<void> {
        const form = new FormData()
        const metadata = { name: req.name, mimeType: 'text/plain' }
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
        form.append('file', new Blob([req.data], {type: 'text/plain'}))
        console.log(form)

        const response = await this.request({
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            data: form
        })

        console.log(response)

        return
    }

    private async request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<AxiosResponse<T>> {
        console.log(`Google request ${config.method || 'GET'} ${config.url}`)

        const response = await this.axios.request<T>({
            ...config,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken,
                ...config.headers
            },
            
        })

        if (response.status !== 200) {
            if (response.status === 401) {
                throw new Error('google_unauthenticated')
            } else {
                console.error(`Google respond ${response.status}: ${response.statusText}`)
                throw new Error('google_api_error')
            }
        }

        return response
    }
}

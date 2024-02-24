export interface Response {
    resourceName?: string | null
}

export interface PeopleMeResponse extends Response {
    emailAddresses: { value: string }[]
}

export interface FilesListResponse extends Response {
    nextPageToken?: string | null

    files: File[]
}

export interface File {
    id: string
    driveId: string
    fileExtension: string
    mimeType: string
    thumbnailLink?: string | null
    iconLink: string
    size: string
    name: string
}

export interface UploadFileRequest {
    name: string
    mimeType: string
    data: ArrayBuffer
}

export interface GetFileRequest {
    id: string
}

export interface DeleteFileRequest {
    id: string
}

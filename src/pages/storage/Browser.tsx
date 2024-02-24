import { useState, useMemo } from 'react'
import { Box, Text } from 'grommet'

import { SecretManager } from '../../state/secret'
import { EncryptAndUploadUseCase, IProvider, Entity } from '../../services/provider'

import { useModal } from '../../components'
import { UploadModal } from './UploadModal'
import { NewEntryModal } from './NewEntryModal'

import { IStoragePageProps } from './props'
import { ISecretContainer } from '../../services/crypto'
import { BrowserLayout, FilesList } from '../../components/browser'

import { BrowserToolbar } from './components/BrowserToolbar'
import { ConnectedFileContent } from './components/ConnectedFileContent'
import { ConnectedFilesList } from './components/ConnecterFilesList'
import { useAsyncLoader } from '../../components/AsyncLoader'

interface IBrowserPartProps extends IStoragePageProps {
    manager: SecretManager
    provider: IProvider
}

export const BrowserPart = (props: IBrowserPartProps) => {
    const upload = useMemo(() => new EncryptAndUploadUseCase(props.provider, props.crypto), [props.provider, props.crypto])
    
    const [selected, setSelected] = useState<Entity | undefined>()

    const loader = useAsyncLoader(() => props.provider.list('/'))
    const refresh = () => loader.reload()
    const uploadEntry = async (data: string, name: string, password: string) => {
        await props.manager.proxyCall((secret: ISecretContainer) => {
            return upload.do({ data, path: '/', name, secret })
        })
        refresh()
    }
    const uploadFile = (password: string, files: File[]) => {
        console.log(password, files);
        // (async () => {
        //     const promises = files.map(f => props.upload.uploadFile(f, password))
        //     await Promise.all(promises)
        // })()
        refresh()
    }
    const uploadModal = useModal(ctx => <UploadModal onClose={ctx.close} onUpload={uploadFile} />)
    const newEntryModal = useModal(ctx => <NewEntryModal onClose={ctx.close} onUpload={uploadEntry} />)

    return <>
        <newEntryModal.Component/>
        <uploadModal.Component/>

        <BrowserLayout
            toolbar={
                <BrowserToolbar
                    onCreateFile={() => newEntryModal.show()}
                    onUploadFile={() => uploadModal.show()}
                    onRefresh={() => refresh()}
                    onDeleteEntry={() => props.provider.delete(selected!.id).then(() => { setSelected(undefined); refresh()})}
                    showFileOperations={!!selected}
                />
            }
            breadcrumbs={<Text>Path: /</Text>}
            list={ loader.render(items => <FilesList items={items} onClick={setSelected} />) }
            view={ selected ? <ConnectedFileContent {...props} item={selected} /> : undefined }
        />
    </>
}


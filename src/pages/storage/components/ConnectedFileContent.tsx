import { useEffect, useState, useMemo, ReactNode } from 'react'
import { Spinner, Text } from 'grommet'

import { Message } from '../../../components'
import { FileContent } from '../../../components/browser'

import { DownloadAndDecryptUseCase, Entity, IProvider } from '../../../services/provider'
import { ICryptoService } from '../../../services/crypto'
import { SecretManager } from '../../../state/secret'

interface IConnectedFileContent {
    manager: SecretManager
    provider: IProvider
    crypto: ICryptoService
    item: Entity
}

export const ConnectedFileContent = (props: IConnectedFileContent) => {
    const download = useMemo(() => new DownloadAndDecryptUseCase(props.provider, props.crypto), [props.provider, props.crypto])
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const [content, setContent] = useState<string>()

    useEffect(() => {
        setLoading(true)
        setError(undefined)
        props.manager.proxyCall(secret => download.do({ fileId: props.item.id, secret }))
            .then(result => {
                if (result.error) {
                    setError(result.error)
                    setContent('')
                } else {
                    setContent(result.result)
                }
            })
            .catch(e => setError('unable to load'))
            .finally(() => setLoading(false))
    }, [props.manager, download, props.item])
    
    let contentElement: ReactNode
    if (loading) {
        contentElement = <Spinner/>
    } else if (error) {
        contentElement = <Message type="error">{error}</Message>
    } else {
        contentElement = <Text>{content}</Text>
    }

    return <FileContent
        onClose={() => {}}
        name={props.item.name}
        content={contentElement}
    />
}

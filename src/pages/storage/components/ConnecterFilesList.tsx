import { useEffect, useState } from 'react'
import { Spinner } from 'grommet'

import { IProvider, Entity } from '../../../services/provider'

import { Message } from '../../../components'

import { FilesList } from '../../../components/browser'

interface IConnectedFilesListProps {
    path: string
    provider: IProvider
    onClick: (entity: Entity) => void
}

export const ConnectedFilesList = (props: IConnectedFilesListProps) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const [items, setItems] = useState<Entity[] | undefined>()

    useEffect(() => {
        setLoading(true)
        setError(undefined)
        props.provider.list(props.path)
            .then(setItems)
            .catch(() => setError('unable to load'))
            .finally(() => setLoading(false))
    }, [props.provider, props.path])
    
    if (loading) {
        return <Spinner/>
    }

    if (error) {
        return <Message type="error">{error}</Message>
    }

    return <FilesList items={items || []} onClick={props.onClick} />
}

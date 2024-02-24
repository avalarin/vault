import { Spinner } from 'grommet'
import { useState, useEffect, useCallback } from 'react'
import { Message } from './Message'

export interface IAsyncLoader<T> {
    render: (fn: (data: T) => JSX.Element) => React.ReactElement
    reload(): void
}

export function useAsyncLoader<T>(loader: () => Promise<T>): IAsyncLoader<T> {
    const [state, setState] = useState<T | undefined>()
    const [busy, setBusy] = useState(true)
    const [error, setError] = useState<Error | undefined>()

    const reload = useCallback(() => {
        setBusy(true)
        loader()
            .then(setState)
            .catch(setError)
            .finally(() => setBusy(false))
    }, [loader])

    useEffect(reload, [])

    return {
        reload,
        render: (fn: (data: T) => JSX.Element) => {
            if (busy) {
                return <Spinner/>
            }
            if (error) {
                return <Message type="error">{error.message}</Message>
            }
            if (state) {
                return fn(state)
            }
            return <></>
        }
    }

}

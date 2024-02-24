import { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'

import { IProviderAuthenticator } from '.'

export interface IGoogleCompletePageProps {
    authenticator: IProviderAuthenticator,
    redirectUrl?: string | null
}

type State = { state: 'loading' } |
             { state: 'error', error: string } |
             { state: 'success' }

export const GoogleCompletePage = (props: IGoogleCompletePageProps) => {
    const location = useLocation()
    const [state, setState] = useState<State>({ state: 'loading' })

    const hashObj = new URLSearchParams(location.hash)
    const accessToken = hashObj.get('access_token') || ''

    if (!accessToken) {
        setState({ state: 'error', error: 'no_access_token' })
    }

    useEffect(() => {
        (async () => {
            try {
                const result = await props.authenticator.complete(accessToken)
                setState(result.authenticated ? { state: 'success' } : { state: 'error', error: 'unauthenticated' })
            } catch {
                setState({ state: 'error', error: 'unknown_error' })
            }
        })()
    }, [props.authenticator, accessToken])

    if (state.state === 'loading') {
        return <span>loading...</span>
    } else if (state.state === 'error') {
        return <span>auth failed: {state.error}</span>
    } else if (state.state === 'success') {
        return <Navigate to={props.redirectUrl || '/'} />
    } else {
        throw new Error('unknown state')
    }
}

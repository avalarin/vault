import { useEffect, useState } from 'react'
import {Box, Text} from 'grommet'
import {Lock, Folder, Magic} from 'grommet-icons'

import { AuthPage } from '../auth/AuthPage'
import { useSecretManager } from '../../state/secret'
import { AuthenticateResult } from '../../services/provider'

import { IStoragePageProps } from './props'
import { KeyPasswordPart } from './KeyPassword'
import { BrowserPart } from './Browser'

export const StoragePage = (props: IStoragePageProps) => {
    const manager = useSecretManager(props.keystore)
    const [auth, setAuth] = useState<AuthenticateResult|null>(null)

    useEffect(() => {
        props.providers.getAuthenticatedProvider().then(setAuth)
    }, [props.providers])

    const state = (() => {
        if (!auth) return 'provider'
        if (!manager.hasDecryptedKey()) return 'encryption-key'
        return 'browse'
    })()

    const body = () => {
        if (state === 'provider') {
            return <AuthPage redirectUrl='/storage' providers={props.providers} />
        }
        if (state === 'encryption-key') {
            return <KeyPasswordPart {...props} manager={manager} />
        }
        return <BrowserPart {...props} manager={manager} provider={auth?.provider!} />
    }

    return <>
        <Box background='light-2' direction='row-responsive' pad='small' gap='small'>
            <Text size='xsmall' weight={state === 'provider' ? 'bold' : 'normal'}>
                <Folder size='small' /> {auth !== null ? `Provider: ${auth?.provider.name}` : `Choose provider`}
            </Text>
            <Text size='xsmall' weight={state === 'encryption-key' ? 'bold' : 'normal'}>
                <Lock size='small' /> {manager.hasDecryptedKey() ? `Key: ${manager.getKeyName()}` : `Choose encryption key`}
            </Text>
        </Box>
        <Box pad='small'>
            {body()}
        </Box>
    </>
}

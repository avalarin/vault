import {Box, Text} from 'grommet'
import {RedirectButton} from './RedirectButton'

import {AuthenticationMethod, ProvidersManager} from '../../services/provider'

export interface IAuthPageProps {
    redirectUrl?: string | null,
    providers: ProvidersManager
}

export const AuthPage = (props: IAuthPageProps) => {
    const methods = props.providers.getAllAuthMethods()

    return <Box gap='small'>
        <Text>Choose the authentication method:</Text>
        { methods!.map((m, i) => <AuthButton key={i} method={m} />) }
    </Box>
}

export const AuthButton = (props: { method: AuthenticationMethod }) => {
    if (props.method.method !== 'redirect') {
        throw new Error('unknown auth method ' + props.method.method)
    }

    if (props.method.type !== 'google') {
        throw new Error('unknown auth provider ' + props.method.type)
    }

    return <RedirectButton
        buttonTitle='Sign in with Google'
        url={props.method.url}
        params={props.method.params}
    />
}


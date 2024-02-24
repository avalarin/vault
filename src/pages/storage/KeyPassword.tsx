import { useState } from 'react'
import { SecretManager } from '../../state/secret'
import { Form, FormField, Text, TextInput, Button, Box, TextArea } from 'grommet'
import { Secure, Scan, New } from 'grommet-icons'
import { useNavigate } from 'react-router-dom'

import { IStoragePageProps } from './props'

interface IKeyPasswordPartProps extends IStoragePageProps {
    manager: SecretManager
}

export const KeyPasswordPart = (props: IKeyPasswordPartProps) => {
    const navigate = useNavigate()
    const presetKey = props.presetkey || props.manager.getEncryptedKey() || ''
    const [encryptedKey, setEncryptedKey] = useState('')
    const [password, setPasword] = useState('')

    const save = async () => {
        await props.manager.putKey(encryptedKey || presetKey)
        await props.manager.putPassword(password!)
    }

    return <Form onSubmit={save} validate="blur">
        { props.manager.getError() && <>
            <Text>Error: '{props.manager.getError()}'</Text>
        </> }

        <FormField label={`Key`} name="key" required>
            <TextArea name="key" value={encryptedKey || presetKey} onChange={e => setEncryptedKey(e.target.value)} />
        </FormField>
        <Box direction="row" align="center" gap="small" margin={{top: ''}}>
            <Button icon={<Scan size="small" />} label="scan qr" type="button" />
            <Button icon={<New size="small" />} label="generate new" type="button"
                onClick={() => navigate(`/qr/new?comment=key+for+storage&autogen=yes`)} />
        </Box>
        <FormField label="Password" name="password" required>
            <TextInput name="password" type="password" value={password} onChange={e => setPasword(e.target.value)} />
        </FormField>
        <Box direction="row" align="center" gap="small" margin={{top: 'small'}}>
            <Button primary icon={<Secure size="small" />} label="save" type="submit" /> 
        </Box>
    </Form>
}

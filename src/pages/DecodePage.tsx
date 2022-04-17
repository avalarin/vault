import { useState, useEffect } from 'react'
import { Form, FormField, TextInput, Button, Box, Paragraph, Text, Grommet } from 'grommet'
import { Message } from '../components'
import { ICryptoService } from '../services'

export interface IDecodePageProps {
    data: string,
    cryptoService: ICryptoService
}

export const DecodePage = (props: IDecodePageProps) => {
    const [error, setError] = useState<string | null>(null)
    const [valid, setValid] = useState(false)
    const [comment, setComment] = useState('')
    const [password, setPasword] = useState('')
    const [decryptedData, setDecryptedData] = useState('')

    useEffect(() => {
        const result = props.cryptoService.validate(props.data)
        if (!result.valid) {
            setError("unable to parse data")
        } else {
            setValid(true)
            setComment(result.comment)
        }
    }, [props.data, props.cryptoService])

    const decode = () => {
        const result = props.cryptoService.decryptFromBase64(props.data, password)
        if (result.error) {
            setError("unable to decrypt data")
            setDecryptedData("")
        } else {
            setError(null)
            setDecryptedData(result.result)
        }
    }

    if (!valid && error) {
        return <Text color="status-error">Error: {error}</Text>
    }

    return <Form onSubmit={decode}>
        { comment && <Box pad={{ bottom: 'small' }}>
            <Message type="info">
                Comment: {comment}
            </Message>
        </Box> }
        { error && <Box pad={{ bottom: 'small' }}>
            <Message type="error">
                Error: {error}
            </Message>
        </Box> }
        
        { !decryptedData && <>
            <FormField label="Password">
                <TextInput value={password} onChange={e => setPasword(e.target.value)} />
            </FormField>
            <Button primary label="decode" onClick={decode} />
        </> }

        { decryptedData && <>
            <Box pad={{ bottom: 'small' }}>
                <Message type="ok">
                    Successfully decrypted
                </Message>
            </Box>
            <Box pad={{ bottom: 'small' }}>
                <Box pad="medium" background="light-2">
                    <Grommet theme={{ global: { font: { face: "monospace" } } }}>
                        <Text>{decryptedData}</Text>
                    </Grommet>
                </Box>
            </Box>
            <Button primary label="copy" onClick={() => {}} />
        </> }
    </Form>
}

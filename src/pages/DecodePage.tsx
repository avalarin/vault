import { useState, useEffect, useMemo } from 'react'
import { Form, FormField, TextInput, Button, Box, Text, Grommet } from 'grommet'
import { Insecure } from 'grommet-icons'
import { Message, CopyContentButton } from '../components'
import { ICryptoService, IDecryptionResult, ParseAndDecryptUseCase, Password } from '../services/crypto'

export interface IDecodePageProps {
    data: string,
    cryptoService: ICryptoService
}

export const DecodePage = (props: IDecodePageProps) => {
    const parseAndDecrypt = useMemo(() => new ParseAndDecryptUseCase(props.cryptoService), [props.cryptoService])

    const [error, setError] = useState<string | null>(null)
    const [valid, setValid] = useState(false)
    const [comment, setComment] = useState('')
    const [password, setPasword] = useState('')
    const [decryptedData, setDecryptedData] = useState('')

    useEffect(() => {
        const result = props.cryptoService.parseContainer(props.data, 'base64')
        if (!result || !result.valid) {
            setError("unable to parse data")
        } else {
            setValid(true)
            setComment(result.comment)
        }
    }, [props.data, props.cryptoService])

    const decode = () => {
        (async () => {
            let result: IDecryptionResult
            try {
                result = await parseAndDecrypt.do({
                    container: props.data,
                    format: 'base64',
                    secret: new Password(password)
                 })
            } catch (e) {
                console.error(e)
                setError("unable to decrypt data")
                setDecryptedData("")
                return
            }
            if (result.error) {
                setError("unable to decrypt data")
                setDecryptedData("")
            } else {
                setError(null)
                setDecryptedData(result.result)
            }
        })()
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
                <TextInput type="password" value={password} onChange={e => setPasword(e.target.value)} />
            </FormField>
            <Box direction="row" align="center" gap="medium" margin={{top: 'small'}}>
                <Button primary icon={<Insecure size="small" />} label="decrypt" onClick={decode} />
            </Box>
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
            <CopyContentButton content={decryptedData} />
        </> }
    </Form>
}

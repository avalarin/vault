import { useCallback, useEffect, useState } from 'react'
import { Form, FormField, TextArea, TextInput, Button, Box } from 'grommet'
import { Secure, New } from 'grommet-icons'
import {BytesLimitMessage, Message} from '../components'
import {IContainer, ICryptoService, Password} from '../services/crypto'
import {IUrlService} from '../services'
import {debounce} from '../utils'

export interface IEncodePageProps {
    onEncoded?: (container: IContainer) => void
    cryptoService: ICryptoService,
    urlService: IUrlService,
    comment: string | null,
    autogen: boolean | null
}

const QR_MAX_SIZE = 2956
const PASSORDS_MATCH_MESSAGE = 'passwords should match'

export const EncodePage = (props: IEncodePageProps) => {
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState('')
    const [password, setPasword] = useState('')
    const [passwordConfirm, setPaswordConfirm] = useState('')
    const [comment, setComment] = useState(props.comment || '')
    const [size, setSize] = useState<number | null>(0)

    const encrypt = async (fields: { data: string, password: string, comment: string }) => {
        try {
            const container = await props.cryptoService.encrypt(fields.data, new Password(fields.password), fields.comment)
            setError(null)
            return container
        } catch (e) {
            console.error(e)
            setError('unable to encrypt data')
        }
    }

    const encode = () => {
        if (!size || size > QR_MAX_SIZE) return
        encrypt({data, password, comment}).then(c => c && props.onEncoded && props.onEncoded(c))
    }

    const generate = useCallback(async () => {
        const key = await props.cryptoService.generateKey()
        const keyStr = await key.serialize()
        setData(keyStr)
    }, [props.cryptoService])

    useEffect(() => {
        if (props.autogen) generate()
    }, [props.autogen, generate])

    const updateSize = debounce(async (fields: { data: string, password: string, comment: string }) => {
        encrypt(fields).then(c => c && setSize(props.urlService.formUrl(c).length))
    })

    const setState = (fields: {  comment: string, data: string, password: string, passwordConfirm: string }) => {
        setSize(null)
        setData(fields.data)
        setPasword(fields.password)
        setPaswordConfirm(fields.passwordConfirm)
        setComment(fields.comment)
        updateSize(fields)
    }

    return <Form onSubmit={encode} validate="blur">
        { error && <Box pad={{ bottom: 'small' }}>
            <Message type="error">
                Error: {error}
            </Message>
        </Box> }
        <FormField label={`Comment (optional)`} name="comment">
            <TextInput name="comment" value={comment} onChange={e => setState({ data, password, comment: e.target.value, passwordConfirm })} />
        </FormField>
        <FormField label={`Data`} name="data" required>
            <TextArea name="data" rows={10} value={data} onChange={e => setState({ data: e.target.value, password, comment, passwordConfirm })} />
        </FormField>
        <Box direction="row" align="center" gap="small" margin={{top: ''}}>
            <Button icon={<New size="small" />} label="generate new secret" type="button" onClick={generate} />
        </Box>
        <FormField label="Password" name="password" required validate={(p: string) => passwordConfirm !== p ? PASSORDS_MATCH_MESSAGE : undefined}>
            <TextInput name="password" type="password" value={password} onChange={e => setState({ data, password: e.target.value, comment, passwordConfirm })} />
        </FormField>
        <FormField label="Password confirmation" name="password-confirm" required validate={(p: string) => password !== p ? PASSORDS_MATCH_MESSAGE : undefined}>
            <TextInput name="password-confirm" type="password" value={passwordConfirm} onChange={e => setState({ data, password, comment, passwordConfirm: e.target.value })} />
        </FormField>
        <Box direction="row" align="center" gap="small" margin={{top: 'small'}}>
            <Button primary icon={<Secure size="small" />} label="encrypt" type="submit" disabled={!!error || !size || size > QR_MAX_SIZE} />
            <BytesLimitMessage inProgress={size === null} actualBytes={size || 0} limitBytes={QR_MAX_SIZE} />
        </Box>
    </Form>
}

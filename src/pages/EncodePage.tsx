import { useState } from 'react'
import { Form, FormField, TextArea, TextInput, Button, Box } from 'grommet'
import { Secure } from 'grommet-icons'
import {BytesLimitMessage} from '../components'
import {IContainer, ICryptoService, IUrlService} from '../services'
import {debounce} from '../utils'

export interface IEncodePageProps {
    onEncoded?: (container: IContainer) => void
    cryptoService: ICryptoService,
    urlService: IUrlService
}

const QR_MAX_SIZE = 2956
const PASSORDS_MATCH_MESSAGE = 'passwords should match'

export const EncodePage = (props: IEncodePageProps) => {
    const [data, setData] = useState('')
    const [password, setPasword] = useState('')
    const [passwordConfirm, setPaswordConfirm] = useState('')
    const [comment, setComment] = useState('')

    const [size, setSize] = useState<number | null>(0)

    const encode = () => {
        if (!size || size > QR_MAX_SIZE) return

        const encoded = props.cryptoService.encrypt(data, password, comment)
        props.onEncoded && props.onEncoded(encoded)
    }

    const updateSize = debounce((fields: { data: string, password: string, comment: string }) => {
        const container = props.cryptoService.encrypt(fields.data, fields.password, fields.comment)
        const url = props.urlService.formUrl(container)
        setSize(url.length)
    })

    const setState = (fields: {  comment: string, data: string, password: string, passwordConfirm: string }) => {
        setSize(null)
        updateSize(fields)
        setData(fields.data)
        setPasword(fields.password)
        setPaswordConfirm(fields.passwordConfirm)
        setComment(fields.comment)
    }

    return <Form onSubmit={encode} validate="blur">
        <FormField label={`Comment (optional)`} name="comment">
            <TextInput name="comment" value={comment} onChange={e => setState({ data, password, comment: e.target.value, passwordConfirm })} />
        </FormField>
        <FormField label={`Data`} name="data" required>
            <TextArea name="data" rows={10} value={data} onChange={e => setState({ data: e.target.value, password, comment, passwordConfirm })} />
        </FormField>
        <FormField label="Password" name="password" required validate={p => passwordConfirm !== p ? PASSORDS_MATCH_MESSAGE : undefined}>
            <TextInput name="password" type="password" value={password} onChange={e => setState({ data, password: e.target.value, comment, passwordConfirm })} />
        </FormField>
        <FormField label="Password confirmation" name="password-confirm" required validate={p => password !== p ? PASSORDS_MATCH_MESSAGE : undefined}>
            <TextInput name="password-confirm" type="password" value={passwordConfirm} onChange={e => setState({ data, password, comment, passwordConfirm: e.target.value })} />
        </FormField>
        <Box direction="row" align="center" gap="small" margin={{top: 'small'}}>
            <Button primary icon={<Secure size="small" />} label="encrypt" type="submit" disabled={!size || size > QR_MAX_SIZE} />
            <BytesLimitMessage inProgress={size === null} actualBytes={size || 0} limitBytes={QR_MAX_SIZE} />
        </Box>
    </Form>
}

import { useState } from 'react'
import { Form, FormField, TextArea, TextInput, Button } from 'grommet'

import {ICryptoService} from '../services'

export interface IDecodePageProps {
    onEncoded?: (encodedData: string) => void
    cryptoService: ICryptoService
}

export const EncodePage = (props: IDecodePageProps) => {
    const [data, setData] = useState('')
    const [password, setPasword] = useState('')
    const [comment, setComment] = useState('')

    const encode = () => {
        const encoded = props.cryptoService.encryptToBase64(data, password, comment)
        props.onEncoded && props.onEncoded(encoded)
    }

    return <Form onSubmit={encode}>
        <FormField label="Data" >
            <TextArea rows={10} value={data} onChange={e => setData(e.target.value)} />
        </FormField>
        <FormField label="Password">
            <TextInput value={password} onChange={e => setPasword(e.target.value)} />
        </FormField>
        <FormField label="Optional comment">
            <TextInput value={comment} onChange={e => setComment(e.target.value)} />
        </FormField>
        <Button primary label="encrypt" onClick={encode} />
    </Form>
}

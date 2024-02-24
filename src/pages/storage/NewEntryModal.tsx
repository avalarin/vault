import { Box, Button, Card, CardHeader, CardBody, CardFooter, Form, FormField, TextInput, TextArea } from 'grommet'
import { Upload } from 'grommet-icons'
import { useState } from 'react'
import { Message } from '../../components/Message'

interface INewEntryModalProps {
    onUpload: (data: string, name: string, password: string) => Promise<void>
    onClose: () => void
}

export const NewEntryModal = (props: INewEntryModalProps) => {
    const [error, setError] = useState<string | null>()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [data, setData] = useState<string>('')
    const [name, setName] = useState<string>('')

    const upload = async () => {
        setLoading(true)
        try {
            await props.onUpload(data, name, password)
            props.onClose()
            setLoading(false)
        } catch (e) {
            console.log(e)
            setError('unable to upload entry')
        }
    }

    return <Card pad='small' gap='0' width='medium'>
        <CardBody pad='small'>
            { error && <Box pad={{ bottom: 'small' }}>
                <Message type="error">
                    Error: {error}
                </Message>
            </Box> }
            <Form onSubmit={upload} validate="blur">
                <FormField label={`File name`} name="name" required>
                    <TextInput name="name" value={name} onChange={e => setName(e.target.value)} />
                </FormField>
                <FormField label={`Data`} name="data" required>
                    <TextArea name="data" rows={10} value={data} onChange={e => setData(e.target.value)} />
                </FormField>
                <FormField label="Password" name="password" required help="It's to check you are remember which private key will be used to encrypt this data">
                    <TextInput name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </FormField>
            </Form>
        </CardBody>
        <CardFooter pad='small'>
            <Button primary icon={<Upload size="small" />} label="upload" onClick={upload} busy={loading} />
        </CardFooter>
    </Card>
}

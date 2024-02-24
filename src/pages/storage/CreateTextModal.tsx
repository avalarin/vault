import { Button, Card, CardHeader, CardBody, CardFooter, Form, FormField, TextInput, FileInput } from 'grommet'
import { Upload } from 'grommet-icons'
import { useState } from 'react'

interface ICreateTextModalProps {
    onUpload: (password: string, files: File[]) => void
    onClose: () => void
}

export const CreateTextModal = (props: ICreateTextModalProps) => {
    const upload = () => {
        props.onUpload(password, files || [])
        props.onClose()
    }

    const [password, setPassword] = useState('')
    const [files, setFiles] = useState<File[]>()

    return <Card width='medium'>
        <CardHeader>Create text entry</CardHeader> 
        <CardBody>
            <Form onSubmit={upload} validate="blur">
                <FormField label="Password" name="password" required help="It's to check you are remember which private key will be used to encrypt this data">
                    <TextInput name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </FormField>

                <FormField label={`File`} name="file" required>
                    <FileInput name="file" onChange={(event, data) => {
                        setFiles(data?.files)
                    }} />
                </FormField>
            </Form>
        </CardBody>
        <CardFooter>
            <Button primary icon={<Upload size="small" />} label="upload" onClick={() => props.onClose()} />
        </CardFooter>
    </Card>
}

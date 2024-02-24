import { Button, Card, CardHeader, CardBody, CardFooter, Text } from 'grommet'
import { IModalController, useModal } from './Modal'

export interface IDialogProps {
    header?: string
    message: string,
    mode: 'notice' | 'confirmation',
    onConfirm?: () => void,
    onCancel?: () => void,
    onClose?: () => void,
}

export const useDialog = (props: IDialogProps): IModalController => {
    return useModal(context => {
        return <DialogModal {...props} onClose={() => {
            context.close()
            props.onClose && props.onClose()
        }} />
    })
}

const DialogModal = (props: IDialogProps) => {
    const wrapCallback = (callback?: () => void) => {
        return () => {
            callback && callback()
            props.onClose && props.onClose()
        }
    }

    return <Card width="medium" gap="small">
        { props.header&& <CardHeader>{props.header}</CardHeader>  }
        <CardBody>
            <Text>{props.message}</Text>
        </CardBody>
        <CardFooter>
            { props.mode === 'confirmation' && <>
                <Button primary label="confirm" onClick={wrapCallback(props.onConfirm)} />
                <Button primary label="cancel" onClick={wrapCallback(props.onCancel)} />
            </> }
            { props.mode === 'notice' && <>
                <Button primary label="ok" onClick={wrapCallback(props.onConfirm)} />
            </> }
        </CardFooter>
    </Card>
}

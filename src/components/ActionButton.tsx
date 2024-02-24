import { useState } from 'react'
import { Button, ButtonExtendedProps } from 'grommet'
import { useDialog } from './Dialog'

export interface IButtonProps extends ButtonExtendedProps {
    onClick?: () => Promise<void>
    onActionError?: (e: Error) => void
    confirmation?: string
}

export const ActionButton = (props: IButtonProps) => {
    const [busy, setBusy] = useState(false)

    const dialog = useDialog({
        message: props.confirmation || '',
        mode: 'confirmation',
        onConfirm: () => onClick(true),
    })

    const onClick = (confirmed: boolean) => {
        if (!props.onClick) return
        if (props.confirmation && !confirmed) {
            dialog.show()
        }
        setBusy(true)
        props.onClick()
            .finally(() => setBusy(false))
            .catch((e) => props.onActionError?.call(undefined, e))
    }

    return <>
        { props.confirmation && dialog.Component({}) }
        <Button {...props} onClick={() => onClick(false)} busy={busy} />
    </>
}

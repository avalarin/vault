import { useState } from 'react'
import { Button } from 'grommet'
import { Clipboard } from 'grommet-icons'

interface ICopyContentButton {
    content: string
}

const copy = async (data: string) => {
    try {
        await navigator.clipboard.write([
            new ClipboardItem({ "text/plain": new Blob([data], { type: "text/plain" }) })
        ])
    } catch (e) {
        console.error("Unable to write to clipboard. :-(");
    }
}

export const CopyContentButton = (props: ICopyContentButton) => {
    const [state, setState] = useState('copy')
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

    const onCopy = async () => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        await copy(props.content)
        setState('copied')
        const id = setTimeout(() => setState('copy'), 2000)
        setTimeoutId(id)
    }

    return <Button primary icon={<Clipboard size="small"/>} label={state} onClick={onCopy} />
}

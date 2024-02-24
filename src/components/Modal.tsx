import { Layer } from 'grommet'
import { useState } from 'react'

export interface IModalController {
    Component: React.FC<{}>
    show(): void
}

export interface IModalProps {
    show: boolean,
    onClose: () => void,
    children: React.ReactNode,
}

export interface IModalContext {
    close(): void
}

export interface IButton {
    title: string,
    icon?: React.ReactElement,
    onClick: () => void
}

export const useModal = (modal: (context: IModalContext) => React.ReactChild): IModalController => {
    const [show, setShow] = useState(false)
    const context = {
        close: () => setShow(false)
    }
    return {
        show: () => setShow(true),
        Component: (props: {}) => {
            return <Modal {...props} show={show} onClose={() => setShow(false)}>
                {modal(context)}
            </Modal>
        }
    }
}

export const Modal = (props: IModalProps) => {
    if (!props.show) return <></>

    return <Layer onEsc={() => props.onClose()} onClickOutside={() => props.onClose()}>
        {props.children}
    </Layer>
}

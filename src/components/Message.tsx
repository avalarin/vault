import { ReactNode } from 'react'
import { Box, Text } from 'grommet'
import { StatusGood, StatusCritical, StatusInfo } from 'grommet-icons'

const icons = {
    "ok": () => <StatusGood size="small"/>,
    "error": () => <StatusCritical size="small"/>,
    "info": () => <StatusInfo size="small"/>
}

const colors = {
    "ok": "status-ok",
    "error": "status-critical",
    "info": "light-2"
}

export interface IMessageProps {
    type: "ok" | "error" | "info"
    children: ReactNode
}

export const Message = (props: IMessageProps) => {
    const icon = icons[props.type]()

    return <Box pad="small" direction="row" align="center" background={colors[props.type]}>
        <Box pad={{right: 'small'}}>
            {icon}
        </Box>
        <Text>{props.children}</Text>
    </Box>
}

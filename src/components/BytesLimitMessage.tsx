import { Text } from 'grommet'

interface IBytesLimitMessageProps {
    inProgress: boolean,
    actualBytes: number,
    limitBytes: number
}

export const BytesLimitMessage = (props: IBytesLimitMessageProps) => {
    if (props.inProgress) {
        return <Text size="xsmall">Calculating...</Text> 
    }
    if (props.actualBytes > props.limitBytes) {
        return <Text size="xsmall" color="status-critical">Maximum size is exceeded: {props.actualBytes} ({props.actualBytes - props.limitBytes} extra bytes)</Text>
    }

    return <Text size="xsmall">Output size: {props.actualBytes} bytes ({props.limitBytes - props.actualBytes} bytes left)</Text>
}

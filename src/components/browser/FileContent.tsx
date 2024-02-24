import { ReactNode } from 'react'
import { Box, Text } from 'grommet'

export interface IFileContentProps {
    name: string
    content: string | ReactNode
    onClose: () => void
}

export const FileContent = (props: IFileContentProps) => {
    return <Box border={{color: 'border'}} direction='column' pad='small' gap='small'>
        <Box border={{color: 'border', side: 'bottom'}}>
            <Text size='small'>{props.name}</Text>
        </Box>
        {props.content}
    </Box> 
}

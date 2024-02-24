
import { Box, Button } from 'grommet'
import { Trash } from 'grommet-icons'

export interface IFileToolbarProps {
    onDeleteFile: () => void,
}

export const FileToolbar = (props: IFileToolbarProps) => {
    return <Box direction='row-responsive' gap='small'>
        <Button icon={<Trash size="small" />} label="create" onClick={props.onDeleteFile} />
    </Box>
}

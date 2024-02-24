import { Box, Button } from 'grommet'
import { Upload, AddCircle, Refresh, Trash } from 'grommet-icons'
import { ActionButton } from '../../../components'

export interface IBrowserToolbarProps {
    onCreateFile: () => void,
    onUploadFile: () => void,
    onRefresh: () => void,
    onDeleteEntry: () => Promise<void>,

    showFileOperations: boolean
}

export const BrowserToolbar = (props: IBrowserToolbarProps) => {
    return <Box direction='row-responsive' gap='small'>
        <Button primary icon={<AddCircle size="small" />} label="create" onClick={props.onCreateFile} />
        <Button primary icon={<Upload size="small" />} label="upload" onClick={props.onUploadFile} />
        <Button icon={<Refresh size="small" />} label="refresh" onClick={props.onRefresh} />
        {props.showFileOperations && <ActionButton
            icon={<Trash size="small" />}
            confirmation="are you sure you want to delete this file?"
            label="delete" 
            onClick={props.onDeleteEntry} /> }
    </Box>
}

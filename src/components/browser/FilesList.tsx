import { Box, List, Text } from 'grommet'
import { DocumentLocked } from 'grommet-icons'

import { Entity } from '../../services/provider'

interface IFilesListProps {
    items: Entity[],
    onClick: (entity: Entity) => void
}

export const FilesList = (props: IFilesListProps) => {
    return <Box border={{ color: 'border' }} overflow="scroll">
        { !props.items.length && <Text>no items found</Text> }
        { props.items.length && <List
            data={props.items}
            show={10}
            itemProps={undefined}
            onClickItem={(e: {item?: Entity}) => e.item && props.onClick(e.item) }
            itemKey={item => item.id}
            primaryKey={item =>
                <Box key={item.id} direction='row-responsive' gap='small'>
                    <DocumentLocked size='medium' />
                    <Text>
                        {item.name}
                    </Text>
                </Box>
            }
        /> }
    </Box>
}

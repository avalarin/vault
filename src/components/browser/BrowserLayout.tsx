import { ReactNode } from 'react'
import { Box, Grid } from 'grommet'

export interface IBrowserLayoutProps {
    toolbar: ReactNode
    breadcrumbs: ReactNode
    list: ReactNode
    view: ReactNode | undefined
}

export const BrowserLayout = (props: IBrowserLayoutProps) => {
    return <Box gap='small'>
        { props.toolbar }
        { props.breadcrumbs }
        <Grid fill
                areas={[
                    { name: 'list', start: [0, 0], end: [0, 0] },
                    { name: 'content', start: [1, 0], end: [1, 0] },
                ]}
                columns={props.view ? ['small', 'flex']: ['flex']}
                rows={['flex']}
                gap="small"
            >
            <Box gridArea='list'>{ props.list }</Box>
            { props.view && <Box gridArea='content'>{ props.view }</Box> }
        </Grid>
    </Box>
}

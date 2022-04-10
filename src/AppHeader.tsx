import { Header, Button, Box } from 'grommet'
import { Shield } from 'grommet-icons'
import {
    useNavigate
} from 'react-router-dom'

export const AppHeader = () => {
    const navigate = useNavigate();

    return <Header background="brand">
        <Box direction="row">
            <Button icon={<Shield/>} label="vault" onClick={() => navigate('/new')} />
            <Button label="new" onClick={() => navigate('/new')} />
        </Box>
    </Header>
}
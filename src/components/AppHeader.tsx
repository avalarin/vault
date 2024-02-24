import { Header, Button, Box } from 'grommet'
import { Shield } from 'grommet-icons'
import { useNavigate } from 'react-router-dom'

export const AppHeader = () => {
    const navigate = useNavigate();

    return <Header background="brand">
        <Box direction="row">
            <Button icon={<Shield/>} label="vault" onClick={() => navigate('/')} />
            <Button label="new qrcode" onClick={() => navigate('/qr/new')} />
            <Button label="storage" onClick={() => navigate('/storage')} />
        </Box>
        <Box direction="row">
            <Button label="github" href="https://github.com/avalarin/vault" />
        </Box>
    </Header>
}

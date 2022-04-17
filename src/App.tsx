import './App.css'
import { Grommet, Box } from 'grommet'
import { hpe } from 'grommet-theme-hpe'
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useSearchParams,
    useNavigate
} from 'react-router-dom'

import {AppHeader} from './AppHeader'
import {DecodePage, EncodePage, ResultPage} from './pages'
import {CryptoService} from './services'

export interface IAppProps {
    configSource: () => IAppConfig
}

export interface IAppConfig {
    baseUrl: string
}

export const App = (props: IAppProps) => {
    const cryptoService = new CryptoService()

    const RenderDecoder = () => {
        const [searchParams] = useSearchParams()
        return <DecodePage
            data={searchParams.get("data") || ""}
            cryptoService={cryptoService}
        />
    }

    const RenderResult = () => {
        const navigate = useNavigate();
        const [searchParams] = useSearchParams()
        return <ResultPage
            urlBase={props.configSource().baseUrl}
            data={searchParams.get("data") || ""}
            goToDecode={(data) => navigate(`/qr/decrypt?data=${data}`)}
            cryptoService={cryptoService}
        />
    }

    const RenderEncoder = () => {
        const navigate = useNavigate();
        return <EncodePage
            cryptoService={cryptoService}
            onEncoded={(data) => navigate(`/qr/result?data=${data}`)}
        />
    }

    return <BrowserRouter>
        <Grommet theme={hpe}>
            <AppHeader />
            <Box pad="medium">
                <Routes>
                    <Route path="/" element={<Navigate to="/qr/new" replace />} />
                    <Route path="/qr/new" element={<RenderEncoder/>} />
                    <Route path="/qr/decrypt" element={<RenderDecoder/>}  />
                    <Route path="/qr/result" element={<RenderResult/>} />
                </Routes>
            </Box>
        </Grommet>
    </BrowserRouter>
}

import { Grommet, Box, Main } from 'grommet'
import { hpe } from 'grommet-theme-hpe'
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useSearchParams,
    useNavigate
} from 'react-router-dom'

import {AppHeader} from './components'
import {DecodePage, EncodePage, ResultPage} from './pages'
import {CryptoService, ICryptoService, IUrlService, UrlService} from './services'
import {ConfigSource} from './config'

export interface IAppProps {
    configSource: ConfigSource
}

const DecodePageRoute = (props: { cryptoService: ICryptoService }) => {
    const [searchParams] = useSearchParams()
    return <DecodePage
        data={searchParams.get("data") || ""}
        cryptoService={props.cryptoService}
    />
}

const ResultPageRoute = (props: { cryptoService: ICryptoService, urlService: IUrlService }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    return <ResultPage
        data={searchParams.get("data") || ""}
        goToDecode={(container) => navigate(`/qr/decrypt?data=${container.serialize()}`)}
        cryptoService={props.cryptoService}
        urlService={props.urlService}
    />
}

const EncodePageRoute = (props: { cryptoService: ICryptoService, urlService: IUrlService }) => {
    const navigate = useNavigate()
    return <EncodePage
        cryptoService={props.cryptoService}
        urlService={props.urlService}
        onEncoded={(container) => navigate(`/qr/result?data=${container.serialize()}`)}
    />
}

export const App = (props: IAppProps) => {
    const services = {
        cryptoService: new CryptoService(),
        urlService: new UrlService(props.configSource)
    }

    return <Grommet theme={hpe}>
        <Box>
            <BrowserRouter>
                <AppHeader />
                <Main pad="medium">
                    <Routes>
                        <Route path="/" element={<Navigate to="/qr/new" replace />} />
                        <Route path="/qr/new" element={<EncodePageRoute {...services} />} />
                        <Route path="/qr/decrypt" element={<DecodePageRoute {...services} />}  />
                        <Route path="/qr/result" element={<ResultPageRoute {...services} />} />
                    </Routes>
                </Main>
            </BrowserRouter>
        </Box>
    </Grommet>
}

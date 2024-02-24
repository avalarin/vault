import { useState } from 'react'
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
import {DecodePage, EncodePage, ResultPage, StoragePage} from './pages'
import {
    IUrlService, UrlService, BrowserKeystoreService,
    ProvidersManager,
    IKeystoreService
} from './services'
import {
    ICryptoService, CryptoService, IContainer,
} from './services/crypto'
import {ConfigSource} from './config'
import { AuthenticationMethod } from './services/provider'

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
    const params = searchParams.get('next') === 'storage' ? {
        goToUsage: (container: IContainer) => navigate(`/storage?key=${container.serialize()}`)
    } : { }

    return <ResultPage
        data={searchParams.get("data") || ""}
        goToDecode={(container) => navigate(`/qr/decrypt?data=${container.serialize()}`)}
        cryptoService={props.cryptoService}
        urlService={props.urlService}
        {...params}
    />
}

const EncodePageRoute = (props: { cryptoService: ICryptoService, urlService: IUrlService }) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const autogen = searchParams.get('autogen') === 'yes'
    return <EncodePage
        cryptoService={props.cryptoService}
        urlService={props.urlService}
        comment={searchParams.get('comment')}
        autogen={autogen}
        onEncoded={(container) => navigate(`/qr/result?${autogen?'next=storage&':''}data=${container.serialize()}`)}
    />
}

const StoragePageRoute = (props: { cryptoService: ICryptoService, keystore: IKeystoreService, providers: ProvidersManager }) => {
    const [searchParams] = useSearchParams()
    const key = searchParams.get('key')
    return <StoragePage
        crypto={props.cryptoService}
        keystore={props.keystore}
        providers={props.providers}
        presetkey={key}
    />
}

const CompletePageRoute = (props: { method: AuthenticationMethod }) => {
    return <>{props.method.completePage()}</>
}

export const App = (props: IAppProps) => {
    const [services] = useState(() => {
        const crypto = new CryptoService()
        return {
            cryptoService: new CryptoService(),
            urlService: new UrlService(props.configSource),
            providers: new ProvidersManager(props.configSource),
            keystore: new BrowserKeystoreService(crypto)
        }
    })

    const methods = services.providers.getAllAuthMethods()

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
                        <Route path="/storage" element={<StoragePageRoute {...services} />} />

                        {methods!.filter(m => m.method === 'redirect').map((m, i) => 
                            <Route key={i} path={`/auth/complete_${m.type}`} element={<CompletePageRoute method={m} />}/>
                        )}
                    </Routes>
                </Main>
            </BrowserRouter>
        </Box>
    </Grommet>
}



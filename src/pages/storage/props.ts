import { ProvidersManager, IKeystoreService } from '../../services'
import { ICryptoService } from '../../services/crypto'

export interface IStoragePageProps {
    crypto: ICryptoService,
    keystore: IKeystoreService,
    providers: ProvidersManager,
    presetkey: string | null
}

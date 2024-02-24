import { useState, useMemo, useEffect } from 'react'
import { ISecretContainer } from '../services/crypto'
import { IKeystoreService } from '../services/keystore'

export type StateError = 'error'

interface State {
    loading: boolean,
    error: StateError | null,
    hasKey: boolean,
    hasDecrypted: boolean,
    encryptedKey: string | null,
    key: ISecretContainer | null,
}

const INIT_STATE: State = {
    loading: false,
    error: null,
    hasKey: false,
    hasDecrypted: false,
    encryptedKey: null,
    key: null
}

export const useSecretManager = (keystore: IKeystoreService): SecretManager => {
    console.log('useSecretManager')
    const [state, setState] = useState<State>(INIT_STATE) 
    const manager = useMemo<SecretManager>(() => {
        console.log('useSecretManager.create')
        return new SecretManager(
            keystore, 'default',
            setState, () => state
        )
    }, [keystore, state])

    useEffect(() => {
        console.log('useSecretManager.init')
        manager.init()
    }, [])

    return manager
}

export class SecretManager {
    constructor(
        private keystore: IKeystoreService,
        private defaultKeyName: string,

        private setState: (fn: (state: State) => State) => void,
        private getState: () => State
    ) {}

    init() {
        this.callAsync(async () => {
            const key = await this.keystore.getEncryptedKey(this.defaultKeyName)
            return {
                hasKey: !!key,
                encryptedKey: key
            }
        })
    }

    getError(): string | null {
        return this.getState().error
    }

    getEncryptedKey(): string | null {
        return this.getState().encryptedKey
    }

    getKeyName(): string | undefined {
        return this.getState().key?.name()
    }

    hasDecryptedKey(): boolean {
        return this.getState().hasDecrypted
    }

    putKey(key: string): Promise<void> {
        return this.callAsync(async () => {
            await this.keystore.storeKey(this.defaultKeyName, key)
            return {
                encryptedKey: key,
                hasKey: true
            }
        })
    }

    putPassword(password: string): Promise<void> {
        return this.callAsync(async () => {
            const result = await this.keystore.extractKey(this.defaultKeyName, password)
            if (!result) {
                throw new Error("no key")
            }

            if (result.error) {
                throw new Error(result.error)
            }

            return {
                hasKey: true,
                hasDecrypted: true,
                key: result.key
            }
        })
    }

    proxyCall<R>(fn: (secret: ISecretContainer) => R): R {
        const state = this.getState()
        if (!state.key) {
            throw new Error('no decrypted key to use')
        }
        return fn(state.key)
    }

    private async callAsync(fn: () => Promise<Partial<State>>): Promise<void> {
        this.setState(state => ({
            ...state,
            loading: true,
            error: null
        }))

        try {
            const newState = await fn()

            this.setState(state => ({
                ...state,
                ...newState,
                loading: false,
                error: null
            }))
        } catch (e) {
            console.error(e)
            this.setState(state => ({
                ...state,
                loading: false,
                error: 'error'
            }))
        }
    }
}

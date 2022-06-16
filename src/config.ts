export interface IAppConfig {
    baseUrl: string
}

export type ConfigSource = () => IAppConfig 

export const DefaultConfigSource = () => {
    const config = (window as any).__config as IAppConfig
    if (!config.baseUrl) {
      config.baseUrl = window.location.origin
    }
    return config
  }

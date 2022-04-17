import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {App, IAppConfig} from './App'
import reportWebVitals from './reportWebVitals'

const configSource = () => {
  const config = (window as any).__config as IAppConfig
  if (!config.baseUrl) {
    config.baseUrl = window.location.origin
  }
  return config
}

ReactDOM.render(
  <React.StrictMode>
    <App configSource={configSource} />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

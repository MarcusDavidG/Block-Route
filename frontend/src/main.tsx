import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/map.css'
import { WagmiProvider } from './providers/WagmiProvider'
import { ThemeProvider } from './providers/ThemeProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </WagmiProvider>
  </React.StrictMode>,
)

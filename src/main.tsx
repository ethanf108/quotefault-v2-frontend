import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'csh-material-bootstrap/dist/csh-material-bootstrap.css';
import { OidcProvider, OidcSecure } from '@axa-fr/react-oidc';
import configuration from './config';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <OidcProvider configuration={configuration}>
            <OidcSecure>
                <App />
            </OidcSecure>
        </OidcProvider>
    </React.StrictMode>,
)

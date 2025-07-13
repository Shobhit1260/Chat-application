import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { store } from './Redux/store'
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
     <Auth0Provider
       domain="dev-ir2u634bo1ue8xg8.us.auth0.com"
       clientId="1xmPEP1CORs03Qb23WzWWVvKHl3gDXlp"
       authorizationParams={{ redirect_uri: window.location.origin ,
       audience:"https://dev-ir2u634bo1ue8xg8.us.auth0.com/api/v2/",
       scope: `
        openid
        profile
        email 
        offline_access
      `
       .trim().replace(/\s+/g, ' ')
       }}
       useRefreshTokens={true}
        cacheLocation="localstorage"
    >
      <Provider store={store}>
        <App />
      </Provider> 
     </Auth0Provider>
    </BrowserRouter>
)

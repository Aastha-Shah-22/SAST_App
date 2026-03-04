import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx'

createRoot(document.getElementById('root')).render( 
   <GoogleOAuthProvider clientId="123470367309-b43gj1nrpqntdaaqbb6gh3nvojvia1vr.apps.googleusercontent.com">

  <StrictMode>
    <App />
  </StrictMode>,
   </GoogleOAuthProvider>
)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './utils/authConfig.js';
import Custos from './pages/Custos.jsx';
import AuthWrapper from './utils/AuthWrapper.jsx'; // Importe o AuthWrapper

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <AuthWrapper>
        <Custos />
      </AuthWrapper>
    </MsalProvider>
  </StrictMode>
);
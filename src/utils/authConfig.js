import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: '123', // Substitua pelo Client ID do seu aplicativo
    authority: 'https://login.microsoftonline.com/1234', // Substitua pelo Tenant ID
    redirectUri: 'http://localhost:3333', // Ou o URL do seu frontend
  },
  cache: {
    cacheLocation: 'sessionStorage', // ou 'localStorage'
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

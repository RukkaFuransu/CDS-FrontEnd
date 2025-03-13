import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: '9b64edc1-30e0-4fd5-a78b-293dddfccdce', // Substitua pelo Client ID do seu aplicativo
    authority: 'https://login.microsoftonline.com/c0bee63d-0b61-4216-8778-274853359815', // Substitua pelo Tenant ID
    redirectUri: 'http://localhost:3333', // Ou o URL do seu frontend
  },
  cache: {
    cacheLocation: 'sessionStorage', // ou 'localStorage'
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
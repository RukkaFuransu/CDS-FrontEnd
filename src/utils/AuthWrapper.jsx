import React from 'react';
import { useMsal } from '@azure/msal-react';
import Loading from '../components/Loading/loading.jsx'; // Importe o componente de loading que você já tem

function AuthWrapper({ children }) {
  const { instance, accounts, inProgress } = useMsal();

  // Verifica se o usuário já está autenticado
  if (accounts.length > 0) {
    return children; // Renderiza o componente filho (Custos.jsx)
  }

  // Se não estiver autenticado, redireciona para o login da Microsoft
  if (inProgress === 'none' && accounts.length === 0) {
    instance.loginRedirect({
      scopes: ['user.read'], // Escopos necessários
    });
  }

  // Exibe a tela de loading enquanto o redirecionamento ocorre
  return <Loading isLoading={true} />;
}

export default AuthWrapper;
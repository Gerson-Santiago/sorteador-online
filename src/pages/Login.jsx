// src/pages/Login.jsx
import React from 'react';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { setUserInfo } = useAuth();

  const loginRedirect = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const data = await res.json();
        setUserInfo(data); // Salva dados no contexto e localStorage
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    },
    onError: () => {
      console.error('Login falhou');
    },
  });

  return (
    <div className="login-page">
      <header className="login-header">{/* logo opcional aqui */}</header>
      <div className="login-container">
        <div className="login-card">
          <h1>Bem-vindo ao Sorteador Online</h1>
          <p>Faça login com sua conta <strong>@seducbertioga.com.br</strong></p>

          <button onClick={() => loginRedirect()} className="google-login-button">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
            <span>Entrar com Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

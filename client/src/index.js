import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { BrowserRouter } from 'react-router-dom';
import {
  AuthProvider,
  fetchToken,
  fetchCsrfToken,
} from './context/AuthContext';
import { AuthErrorEventBus } from './context/AuthContext';
import HttpClient from './network/http';
import Socket from './network/socket';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(
  baseURL, //
  authErrorEventBus,
  () => fetchCsrfToken() // csrf 토큰
); // http요청을 보내는곳
const authService = new AuthService(httpClient);
// 소켓통신 - baseurl과 저장된 토큰을 전달
const socketClient = new Socket(baseURL, () => fetchToken); // memory상의 토큰을 보관하여 보냄
const tweetService = new TweetService(httpClient, socketClient);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider
        authService={authService}
        authErrorEventBus={authErrorEventBus}
      >
        <App tweetService={tweetService} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

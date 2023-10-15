import React from 'react';
import { Provider } from 'react-redux';
import { initReactI18next } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import i18next from 'i18next';
import { io } from 'socket.io-client';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import { SocketContext } from './contexts/index.jsx';
import resources from './locales/index.js';
import App from './components/App';
import store from './slices/index.js';
import rollbarConfig from './rollbar/rollbarConfig.js';

const init = async (socket) => {
  const defaultLang = 'ru';
  const instance = i18next.createInstance();
  await instance
    .use(initReactI18next)
    .init({
      lng: defaultLang,
      debug: false,
      resources,
      interpolation: {
        escapeValue: false,
      },
    });

  const SocketProvider = ({ children }) => {
    const getResult = (...args) => new Promise((resolve, reject) => {
      socket.timeout(3000).emit(...args, (error, response) => {
        if (response?.status === 'ok') {
          resolve(response);
        }
        reject(error);
      });
    });

    return (
      <SocketContext.Provider value={{ socket, getResult }}>
        {children}
      </SocketContext.Provider>
    );
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <SocketProvider>
            <App />
          </SocketProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default async () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  const socket = io();
  const vdom = await init(socket);
  root.render(vdom);
};

import React from 'react';
import { Provider } from 'react-redux';
import { initReactI18next } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import i18next from 'i18next';
import { io } from 'socket.io-client';
import { SocketContext } from './contexts/index.jsx';
import resources from './locales/index.js';
import App from './components/App';
import store from './slices/index.js';

const init = async (socket) => {
  const defaultLang = 'ru';
  const instance = i18next.createInstance();
  await instance
    .use(initReactI18next)
    .init({
      lng: defaultLang,
      debug: false,
      resources,
    });

  const SocketProvider = ({ children }) => (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );

  return (
    <Provider store={store}>
      <SocketProvider value={socket}>
        <App />
      </SocketProvider>
    </Provider>
  );
};

export default async () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  const socket = io();
  const vdom = await init(socket);
  root.render(vdom);
};

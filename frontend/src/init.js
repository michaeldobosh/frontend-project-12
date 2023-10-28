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
import {
  addChannel,
  removeChannel,
  renameChannel,
  setCurrentChannelId,
} from './slices/channelsSlice';
import { addMessage } from './slices/messagesSlice';

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

  const defaultChannelId = 1;

  socket.on('newMessage', (newMessage) => {
    store.dispatch(addMessage(newMessage));
  });

  socket.on('newChannel', (data) => {
    store.dispatch(addChannel(data));
  });

  socket.on('renameChannel', (data) => {
    store.dispatch(renameChannel(data));
    const { channels: { currentChannelId } } = store.getState();
    if (currentChannelId === data.id) {
      store.dispatch(setCurrentChannelId(data.id));
    }
  });

  socket.on('removeChannel', (data) => {
    store.dispatch(removeChannel(data.id));
    const { channels: { currentChannelId } } = store.getState();
    if (currentChannelId === data.id) {
      store.dispatch(setCurrentChannelId(defaultChannelId));
    }
  });

  const SocketProvider = ({ children }) => {
    const sendData = (...args) => new Promise((resolve, reject) => {
      socket.timeout(3000).emit(...args, (error, response) => {
        if (response?.status === 'ok') {
          resolve(response);
        }
        reject(error);
      });
    });

    const socketApi = {
      sendMessage: (message) => sendData('newMessage', message),
      addChannel: (channel) => sendData('newChannel', channel),
      renameChannel: (channel) => sendData('renameChannel', channel),
      removeChannel: (channel) => sendData('removeChannel', channel),
    };

    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <SocketContext.Provider value={{ socketApi }}>
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
  const container = document.getElementById('chat');
  const root = createRoot(container);
  const socket = io();
  const vdom = await init(socket);
  root.render(vdom);
};

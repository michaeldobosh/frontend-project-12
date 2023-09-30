import { createRoot } from 'react-dom/client';
import React from 'react';
import { Provider } from 'react-redux';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './components/App';
import instance from './init.js';
import store from './slices/index.js';

instance();

const container = document.getElementById('root');
const root = createRoot(container);
root.render((
  <Provider store={store}>
    <App />
  </Provider>
));

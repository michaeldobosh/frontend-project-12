import React, { useState, useMemo, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from './Layout';
import Chat from './Chat';
import LoginPage from './Login';
import Error from './Error404';
import Registration from './Signup';
import { UserContext } from '../contexts/index.jsx';
import { useAuth } from '../hooks/index.jsx';
import getAuthHeader from '../getAuthHeader.js';

const AuthProvider = ({ children }) => {
  const { Authorization } = getAuthHeader();
  const [loggedIn, setLoggedIn] = useState(!!Authorization);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  return (
    auth.loggedIn ? children : <Navigate to="login" />
  );
};

const PrivateRoute2 = ({ children }) => {
  const auth = useAuth();

  return (
    !auth.loggedIn ? children : <Navigate to="/" />
  );
};

// localStorage.removeItem('userId');
const App = () => {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="login" element={<PrivateRoute2><LoginPage /></PrivateRoute2>} />
            <Route path="signup" element={<PrivateRoute2><Registration /></PrivateRoute2>} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

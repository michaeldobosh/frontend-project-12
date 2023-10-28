import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Layout from './Layout';
import Chat from './Chat';
import LoginPage from './Login';
import Error from './Error404';
import SignupPage from './Signup';
import { UserContext } from '../contexts/index.jsx';
import { useAuth } from '../hooks/index.jsx';
import getAuthHeader from '../getAuthHeader.js';
import FormContainer from './FormContainer';
import Channels from './chat/Channels.jsx';
import routes from '../routes';

const { loginPage, chatPage, signupPage } = routes;

const AuthProvider = ({ children }) => {
  const { Authorization } = getAuthHeader();
  const [loggedIn, setLoggedIn] = useState(!!Authorization);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider value={useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn])}>
      {children}
    </UserContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  return (
    auth.loggedIn ? children : <Navigate to={loginPage} />
  );
};

const RedirectToChat = ({ children }) => {
  const auth = useAuth();
  return (
    !auth.loggedIn ? children : <Navigate to={chatPage} />
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path={chatPage} element={<Layout />}>
          <Route
            index
            element={(
              <PrivateRoute>
                <Chat>
                  <Channels />
                </Chat>
              </PrivateRoute>
            )}
          />
          <Route element={<FormContainer />}>
            <Route path={loginPage} element={<RedirectToChat><LoginPage /></RedirectToChat>} />
            <Route path={signupPage} element={<RedirectToChat><SignupPage /></RedirectToChat>} />
          </Route>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;

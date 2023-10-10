import React, { useState } from 'react';
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
    localStorage.removeItem('username');
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

const RedirectToChat = ({ children }) => {
  const auth = useAuth();
  return (
    !auth.loggedIn ? children : <Navigate to="/" />
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="login" element={<RedirectToChat><LoginPage /></RedirectToChat>} />
          <Route path="signup" element={<RedirectToChat><Registration /></RedirectToChat>} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;

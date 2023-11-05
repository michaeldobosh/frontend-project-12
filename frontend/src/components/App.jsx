import React, { useMemo, useState } from 'react';
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
import FormContainer from './FormContainer';
import Channels from './chat/Channels.jsx';
import routes from '../routes';

const { loginPage, chatPage, signupPage } = routes;

const AuthProvider = ({ children }) => {
  const data = JSON.parse(localStorage.getItem('userId'));
  const [userId, setUserId] = useState(data);

  const logIn = ({ token, userName }) => {
    localStorage.setItem('userId', JSON.stringify({ token, userName }));
    setUserId({ token, userName });
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setUserId({});
  };

  return (
    <UserContext.Provider value={useMemo(() => ({ userId, logIn, logOut }), [userId])}>
      {children}
    </UserContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const { userId } = useAuth();
  return (
    userId?.token ? children : <Navigate to={loginPage} />
  );
};

const RedirectToChat = ({ children }) => {
  const { userId } = useAuth();
  return (
    !userId?.token ? children : <Navigate to={chatPage} />
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

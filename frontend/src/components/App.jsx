import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { UserContext, CurrentChannel } from '../contexts/index.jsx';
import { useAuth } from '../hooks/index.jsx';
import getAuthHeader from '../getAuthHeader.js';
import { fetchChannels, setCurrentChannel } from '../slices/channelsSlice';
import { fetchMessages } from '../slices/messagesSlice';
import FormContainer from './FormContainer';

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

const CurrentChannelProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { defaultChannel, currentChannel } = useSelector((state) => state.channels);

  useEffect(() => {
    dispatch(fetchMessages());
    dispatch(fetchChannels());
  }, []);

  return (
    <CurrentChannel.Provider value={useMemo(() => ({
      currentChannel,
      setCurrentChannel,
      defaultChannel,
    }), [currentChannel, defaultChannel])}
    >
      {children}
    </CurrentChannel.Provider>
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
          <Route
            index
            element={(
              <PrivateRoute>
                <CurrentChannelProvider>
                  <Chat />
                </CurrentChannelProvider>
              </PrivateRoute>
            )}
          />
          <Route element={<FormContainer />}>
            <Route path="login" element={<RedirectToChat><LoginPage /></RedirectToChat>} />
            <Route path="signup" element={<RedirectToChat><Registration /></RedirectToChat>} />
          </Route>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;

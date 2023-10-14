const apiPath = '/api/v1';

const apiHost = {
  development: 'http://localhost:3000',
  production: process.env.REACT_APP_HOST_NAME,
};

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  baseUrl: () => apiHost[process.env.NODE_ENV],
};

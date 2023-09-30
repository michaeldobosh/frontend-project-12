// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// import routes from './routes.js';
// import Chat from './components/Chat';

export default () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId?.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

// const PrivatePage = () => {
//   const [state, setState] = useState('');

//   useEffect(() => {
//     const authorization = async () => {
//       const path = await routes.dataPath();
//       const dataId = getAuthHeader();
//       const { data } = await axios({ method: 'get', url: path, headers: dataId });

//       setState(data);
//     };

//     authorization();
//   }, []);

//   return <Chat data={state} />;
// };

// export default PrivatePage;

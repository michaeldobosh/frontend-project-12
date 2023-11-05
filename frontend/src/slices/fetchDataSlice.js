import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

export default createAsyncThunk('data/fetchData', async ({ userId, logOut }) => {
  try {
    const Authorization = `Bearer ${userId.token}`;
    const response = await axios
      .get(routes.dataPath(), { headers: { Authorization } });
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      logOut();
    }
    throw error;
  }
});

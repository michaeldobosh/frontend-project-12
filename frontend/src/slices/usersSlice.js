import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import getAuthHeader from '../getAuthHeader.js';
import { actions as usersActions } from './usersSlice.js';
import routes from '../routes.js';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const dataId = await getAuthHeader();
    const response = await axios.get(routes.dataPath(), { headers: dataId });
    return response.data;
  },
);

export const sendUser = createAsyncThunk(
  'users/sendUser',
  async (user) => {
    const response = await axios.post(routes.dataPath(), user, { headers: dataId });
    return response.data;
  },
);

export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (userId) => {
    const response = await axios.delete(routes.dataPath(userId), { headers: dataId });
    return response.data;
  },
);

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState();

const usersSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        usersAdapter.addMany(state, action);
      })
      .addCase(sendUser.fulfilled, usersAdapter.addOne)
      .addCase(removeUser.fulfilled, usersAdapter.removeOne);
  },
});

export const selectors = usersAdapter.getSelectors((state) => state.users);
export default usersSlice.reducer;

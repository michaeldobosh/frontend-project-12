import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import getAuthHeader from '../getAuthHeader.js';
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
  'users/newUser',
  async (user) => {
    const dataId = await getAuthHeader();
    const response = await axios.post(routes.dataPath(), user, { headers: dataId });
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
      .addCase(sendUser.fulfilled, usersAdapter.addOne);
  },
});

export const selectors = usersAdapter.getSelectors((state) => state.users);
export default usersSlice.reducer;

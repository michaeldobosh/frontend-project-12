import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import getAuthHeader from '../getAuthHeader.js';
import { actions as usersActions } from './usersSlice.js';
import routes from '../routes.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const dataId = await getAuthHeader();
    const response = await axios.get(routes.dataPath(), { headers: dataId });
    return response.data.channels;
  },
);

export const sendChannel = createAsyncThunk(
  'channels/sendChannel',
  async (channel) => {
    const response = await axios.post(routes.dataPath(), channel, { headers: dataId });
    return response.data;
  },
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId) => {
    const response = await axios.delete(routes.dataPath(channelId), { headers: dataId });
    return response.data;
  },
);

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, action) => {
        channelsAdapter.addMany(state, action);
      })
      .addCase(sendChannel.fulfilled, channelsAdapter.addOne)
      .addCase(removeChannel.fulfilled, channelsAdapter.removeOne);
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;

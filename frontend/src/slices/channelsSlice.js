import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk, current } from '@reduxjs/toolkit';
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

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: (state, { payload }) => {
      state.entities[payload.id].name = payload.name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, action) => {
        channelsAdapter.addMany(state, action);
      });
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const { addChannel, removeChannel, renameChannel } = channelsSlice.actions;
export default channelsSlice.reducer;

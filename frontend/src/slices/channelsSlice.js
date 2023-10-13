import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk, current } from '@reduxjs/toolkit';
import getAuthHeader from '../getAuthHeader.js';
import routes from '../routes.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const dataId = await getAuthHeader();
    const response = await axios.get(routes.dataPath(), { headers: dataId });
    return response.data;
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
    setCurrentChannel: (state, { payload }) => {
      // console.log(current(state));
      // console.log(payload);
      state.currentChannel = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, { payload }) => {
        channelsAdapter.addMany(state, payload.channels);
        state.defaultChannel = payload.channels.find(({ id }) => id === payload.currentChannelId);

        if (!state.currentChannel) {
          state.currentChannel = { id: state.defaultChannel.id, name: state.defaultChannel.name };
        }
      });
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const {
  addChannel,
  removeChannel,
  renameChannel,
  setCurrentChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;

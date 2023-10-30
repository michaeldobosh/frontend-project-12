import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';
import { removeChannel } from './channelsSlice.js';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (token) => {
    const response = await axios.get(routes.dataPath(), { headers: { Authorization: token } });
    return response.data;
  },
);

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, { payload }) => {
        const channelId = payload;
        const resMessages = Object.values(state.entities)
          .filter(({ messageChannelId }) => messageChannelId !== channelId);
        messagesAdapter.setAll(state, resMessages);
      })
      .addCase(fetchMessages.fulfilled, (state, { payload }) => {
        messagesAdapter.addMany(state, payload.messages);
      });
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;

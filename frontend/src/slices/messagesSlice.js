import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import getAuthHeader from '../getAuthHeader.js';
import { actions as usersActions } from './usersSlice.js';
import routes from '../routes.js';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const dataId = await getAuthHeader();
    const response = await axios.get(routes.dataPath(), { headers: dataId });
    console.log(response.data);
    return response.data.messages;
  },
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (message) => {
    const response = await axios.post(routes.dataPath(), message, { headers: dataId });

    return response.data;
  },
);

export const removeMessage = createAsyncThunk(
  'messages/removeMessage',
  async (messageId) => {
    const response = await axios.delete(routes.dataPath(messageId), { headers: dataId });
    return response.data;
  },
);

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        messagesAdapter.addMany(state, action);
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        console.log(action)
        messagesAdapter.addOne(state, action);
      })
      .addCase(removeMessage.fulfilled, messagesAdapter.removeOne);
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;

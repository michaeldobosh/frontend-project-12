import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
} from 'react-bootstrap';
import filter from 'leo-profanity';

import { useSocket, useCurrentChannel } from '../hooks/index.jsx';
import { addMessage, selectors as extractMessages } from '../slices/messagesSlice';
import {
  addChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice';
import getModal from '../modals/index.js';
import Header from './chat/Header.jsx';
import Channels from './chat/Channels.jsx';
import Messages from './chat/Messages.jsx';

const renderModal = (api, handleClose, modals) => {
  if (!modals.action) return null;

  const Component = getModal(modals.action);
  return <Component api={api} handleClose={handleClose} modalsInfo={modals} />;
};

const Chat = () => {
  filter.loadDictionary('ru');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { socket, getResult } = useSocket();

  const api = {
    sendMessage: (message) => getResult('newMessage', message),
    addChannel: (channel) => getResult('newChannel', channel),
    renameChannel: (channel) => getResult('renameChannel', channel),
    removeChannel: (channel) => getResult('removeChannel', channel),
  };

  const sendButton = useRef();

  const [chatMessage, setMessage] = useState('');
  const [modalsInfo, setModalsInfo] = useState({});
  const [error, setError] = useState('');
  const { currentChannel } = useCurrentChannel();

  const currentUser = localStorage.getItem('username');
  const messages = useSelector(extractMessages.selectAll);

  const currentChannelMessages = messages
    .filter(({ messageChannel }) => messageChannel === currentChannel?.name);

  useEffect(() => {
    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
      setMessage('');
    });
    socket.on('newChannel', (data) => {
      dispatch(addChannel(data));
    });
    socket.on('renameChannel', (data) => {
      dispatch(renameChannel(data));
    });
    socket.on('removeChannel', (data) => {
      dispatch(removeChannel(data.id));
    });
  }, []);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setError('');
    sendButton.current.disabled = true;
    const newMessage = {
      message: filter.clean(chatMessage),
      messageChannel: currentChannel.name,
      username: currentUser,
    };

    try {
      await api.sendMessage(newMessage);
    } catch (err) {
      setError(err.message.replaceAll(' ', '_'));
      sendButton.current.disabled = false;
    }
  };

  const handleShow = (evt) => {
    const modal = {
      action: evt.target.dataset.action,
      id: evt.target.dataset.id,
      name: evt.target.dataset.name,
    };

    setModalsInfo(modal);
  };

  const handleClose = () => setModalsInfo({});

  return currentChannel && (
    <Container className="d-md-block shadow">
      <Row className="row-cols-2">
        <Header handleShow={handleShow} messagesCount={currentChannelMessages.length} />
        <Channels handleShow={handleShow} />
        {renderModal(api, handleClose, modalsInfo)}
        <Col className="p-3 col-8 col-md-9 col-lg-10 text-start">
          <Messages messages={currentChannelMessages} error={error} />
          <Form onSubmit={onSubmit} style={{ position: 'relative', bottom: 0 }}>
            <Form.Group className="input-group-text p-0 bg-white">
              <Form.Control
                autoFocus
                type="text"
                name="message"
                value={chatMessage}
                onChange={(e) => setMessage(e.target.value)}
                aria-label={t('new_message')}
                placeholder={t('enter_your_message')}
                className="border-0"
              />
              <Button
                ref={sendButton}
                type="submit"
                variant="outline"
                className="input-group-text border-0"
                disabled={!chatMessage}
              >
                <i className="bi bi-chat-text" />
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;

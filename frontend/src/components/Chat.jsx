import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  ListGroup,
} from 'react-bootstrap';
import filter from 'leo-profanity';
import { useSocket } from '../hooks/index.jsx';
import { fetchMessages, addMessage, selectors as storeMessages } from '../slices/messagesSlice';
import { fetchChannels, setCurrentChannel } from '../slices/channelsSlice';
import Channels from './Channels';

const Chat = () => {
  filter.loadDictionary('ru');
  const socket = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [chatMessage, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMessages());
    dispatch(fetchChannels());
    dispatch(setCurrentChannel({ id: 1, name: 'general' }));
    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
      setMessage('');
    });
  }, []);

  const currentChannel = useSelector((state) => state.channels.currentChannel);
  const currentUser = localStorage.getItem('username');
  const messages = useSelector(storeMessages.selectAll);
  const currentChannelMessage = messages
    .filter(({ messageChannel }) => currentChannel.name === messageChannel);

  const messagesClassNames = (user) => cn(
    'm-2 p-2 rounded-top-4 rounded-end-4 text-start d-block',
    { 'align-self-end': user === currentUser },
  );

  const variantMessage = (user) => cn({
    success: user === currentUser,
    dark: user !== currentUser,
  });

  const onSubmit = (evt) => {
    evt.preventDefault();
    const newMessage = {
      message: filter.clean(chatMessage),
      username: currentUser,
      messageChannel: currentChannel.name,
      channelId: currentChannel.id,
    };
    socket.emit('newMessage', newMessage);
  };

  return (
    <Container className="w-75 d-md-block shadow" style={{ height: 800 }}>
      <Row className="row-cols-3">
        <Channels />
        <Col className="p-3 col-10 text-start overflow-y-auto" style={{ height: 650, backgroundColor: '#FAFAFA' }}>
          <ListGroup className="d-flex flex-column px-2 mb-3">
            {messages
            && currentChannelMessage.map(({
              id,
              message,
              username,
            }) => (
              <ListGroup.Item key={id} variant={variantMessage(username)} className={messagesClassNames(username)} style={{ minHeight: `${40}px`, width: `${30}rem` }}>
                <span className="fw-bold">
                  {`${username}: `}
                </span>
                {message}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col className="py-4 px-5 col-2 border-end border-3 border-light bg-secondary bg-opacity-50" />
        <Col className="col-10 bg-secondary bg-opacity-50" style={{ height: 70, backgroundColor: '#FAFAFA' }}>
          <Form className="px-1 py-3" onSubmit={onSubmit}>
            <Form.Group controlId="exampleInputMessage" className="input-group-text p-0 bg-white">
              <Form.Control
                autoFocus
                type="message"
                name="message"
                value={chatMessage}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('enter_your_message')}
                className="border-0"
              />
              <Button type="submit" variant="outline" className="input-group-text border-0" disabled={!chatMessage}>
                <i className="bi bi-arrow-right-circle" />
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;

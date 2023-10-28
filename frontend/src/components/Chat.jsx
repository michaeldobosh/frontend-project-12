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
import { ToastContainer } from 'react-toastify';

import { useSocket } from '../hooks/index.jsx';
import { fetchMessages, selectors } from '../slices/messagesSlice';
import { fetchChannels } from '../slices/channelsSlice';
import MessagesBox from './chat/MessagesBox.jsx';

const Chat = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { socketApi } = useSocket();
  const inputRef = useRef();
  const [chatMessage, setChatMessage] = useState('');
  const [chatErrors, setChatErrors] = useState('');
  const [onSubmitting, setSubmitting] = useState(false);

  const currentUser = localStorage.getItem('username');
  const { currentChannelId } = useSelector(({ channels }) => channels);
  const messages = useSelector(selectors.selectAll);

  useEffect(() => {
    dispatch(fetchMessages());
    dispatch(fetchChannels());
  }, []);

  useEffect(() => {
    setChatMessage('');
    setSubmitting(false);
  }, [messages]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [onSubmitting, currentChannelId]);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setSubmitting(true);
    setChatErrors('');
    const newMessage = {
      message: filter.clean(chatMessage),
      messageChannelId: currentChannelId,
      username: currentUser,
    };

    try {
      await socketApi.sendMessage(newMessage);
    } catch (err) {
      setChatErrors('сonnection_error');
      setSubmitting(false);
    }
  };

  return currentChannelId && (
    <>
      <Container className="shadow my-4 h-100 overflow-hidden rounded bg-white">
        <Row className="flex-md-row h-100 ">
          {children}
          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">
              <MessagesBox errors={chatErrors} />
              <div className="mt-auto px-5 py-3">
                <Form onSubmit={onSubmit} style={{ position: 'relative', bottom: 0 }}>
                  <Form.Group className="input-group-text p-0 bg-white">
                    <Form.Control
                      ref={inputRef}
                      type="text"
                      name="message"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      aria-label={t('new_message')}
                      placeholder={t('enter_your_message')}
                      className="border-0"
                      disabled={onSubmitting}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="input-group-text border-0"
                      disabled={!chatMessage || onSubmitting}
                    >
                      <i className="bi bi-chat-text" />
                    </Button>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Chat;

import axios from 'axios';
import { io } from 'socket.io-client';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useImmer } from "use-immer";
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import * as yup from 'yup';
import _ from 'lodash';
import { useSocket, useAuth } from '../hooks/index.jsx';
import routes from '../routes';
import { fetchMessages, addMessage, selectors as storeMessages } from '../slices/messagesSlice';
import { fetchChannels, addChannel, removeChannel, selectors } from '../slices/channelsSlice';
import { fetchUsers, addUser, removeUser, selectors as storeUsers } from '../slices/usersSlice';
import Channels from './Channels';

const Chat = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchMessages());
    dispatch(fetchChannels());
    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
    });
  }, []);

  const [{ currentUser, currentRoom }, setCurrent] = useImmer({
    currentUser: localStorage.getItem('username'),
    currentRoom: { id: 1, name: 'general' },
  });

  const users = useSelector(storeUsers.selectAll);
  console.log(users);
  const messages = useSelector(storeMessages.selectAll);
  const currentRoomMessage = messages.filter(({ room }) => currentRoom.name === room);

  const messagesClassNames = (user) => cn(
    'm-2 p-2 bg-secondary rounded-top-4 rounded-end-4 text-light text-start d-block',
    { 'align-self-end': user === currentUser },
  );

  const onSubmit = ({ message }, actions) => {
    const username = localStorage.getItem('username');
    const newMessage = { message, username, room: currentRoom.name, channelId: currentRoom.id };
    socket.emit('newMessage', newMessage);
    actions.resetForm();
  };

  return (
    <Container className="w-75 d-md-block shadow" style={{ height: 800 }}>
      <Row className="row-cols-3">
        <Channels currentRoom={currentRoom} setRoom={setCurrent} />
        <Col className="p-3 col-10 text-start overflow-y-auto" style={{ height: 620, backgroundColor: '#FAFAFA' }}>
          <ul className="d-flex flex-column px-2 mb-3">
            {messages
            && currentRoomMessage.map(({
              id,
              message,
              username,
            }) => (
              <li key={id} className={messagesClassNames(username)} style={{ minHeight: `${40}px`, width: `${30}rem` }}>
                <span className="fw-bold">
                  {`${username}: `}
                </span>
                {message}
              </li>
            ))}
          </ul>
        </Col>
        <Col className="py-4 px-5 col-2 border-end border-3 border-light" style={{ height: 100, backgroundColor: '#DADADA' }} />
        <Col className="col-10" style={{ height: 100, backgroundColor: '#FAFAFA' }}>
          <Formik
            initialValues={{ message: '' }}
            onSubmit={onSubmit}
          >
            <Form className="position-relative top-50">
              <div className="input-group">
                <Field
                  type="message"
                  name="message"
                  className="form-control"
                  id="exampleInputMessage"
                  autoComplete="message"
                  placeholder={t('enter_your_message')}
                />
                <button type="submit" className="input-group-text">
                  <i className="bi bi-arrow-right-circle" />
                </button>
              </div>
            </Form>
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;

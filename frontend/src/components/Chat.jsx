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
import routes from '../routes';
import useAuth from '../hooks/index.jsx';
import { fetchMessages, addMessage, removeMessage } from '../slices/messagesSlice';
import { fetchChannels, sendChannel, removeChannel } from '../slices/channelsSlice';
import { fetchUsers, sendUser, removeUser } from '../slices/usersSlice';

const socket = io('ws://localhost:3000');

const Chat = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchMessages());
    dispatch(fetchChannels());
    dispatch(fetchUsers());
  }, []);

  const [{ currentUser, currentRoom }, setCurrent] = useImmer({
    currentUser: localStorage.getItem('username'),
    currentRoom: 'general',
  });
  const { channels, messages, users } = useSelector((state) => state);

  socket.on('newMessage', (newMessage) => {
    dispatch(addMessage(newMessage));
  });

  const currentRoomMessage = Object.values(messages.entities)
    .filter(({ room }) => currentRoom === room);

  const data = useSelector((state) => state);

  const buttonsClassNames = (room) => cn('w-100 rounded-0 text-start btn', { 'btn-secondary': room === currentRoom });
  const messagesClassNames = (user) => cn('m-2 p-2 bg-secondary rounded-top-4 rounded-end-4 text-light text-start d-block', { 'align-self-end': user === currentUser });

  const onSubmit = ({ message }, actions) => {
    const username = localStorage.getItem('username');
    const newMessage = { message, username, room: currentRoom };
    socket.emit('newMessage', newMessage);
    actions.resetForm();
  };

  const changeRoom = (name) => {
    setCurrent((draft) => {
      draft.currentRoom = name;
    });
  };

  return (
    <Container className="w-75 d-md-block shadow" style={{ height: 800 }}>
      <Row className="row-cols-3">
        <Col
          className="p-4 col-1 fw-bold d-md-block border-bottom border-3 border-light"
          style={{ height: 80, backgroundColor: '#DADADA' }}
        >
          {t('channels')}
        </Col>
        <Col
          className="p-3 col-1 border-end border-bottom border-3 border-light"
          style={{ height: 80, backgroundColor: '#DADADA' }}
        >
          <button type="button" className="btn btn-lg mx-4 p-1">
            <i className="bi bi-clipboard-plus" />
          </button>
        </Col>
        <Col
          className="p-3 col-10 border-bottom border-3 border-light"
          style={{ height: 80, backgroundColor: '#DADADA' }}
        >
          <span className="fw-bold">{`# ${currentRoom}`}</span>
          <br />
          <span>{`${currentRoomMessage.length} ${t('messages', { count: currentRoomMessage.length })}`}</span>
        </Col>
        <Col
          className="py-4 px-0 col-2 border-end border-3 border-light"
          style={{ height: 620, backgroundColor: '#DADADA' }}
        >
          <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {Object.values(channels.entities).map(({ id, name }) => (
              <li key={id}>
                <button
                  type="button"
                  className={buttonsClassNames(name)}
                  onClick={() => changeRoom(name)}
                >
                  {`# ${name}`}
                </button>
              </li>
            ))}
          </ul>
        </Col>
        <Col className="p-3 col-10 text-start" style={{ height: 620, backgroundColor: '#FAFAFA' }}>
          <ul className="d-flex flex-column px-2 mb-3">
            {messages.entities
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

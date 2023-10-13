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
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import filter from 'leo-profanity';
import { ToastContainer } from 'react-toastify';
import { useSocket, useCurrentChannel } from '../hooks/index.jsx';
import { addMessage, selectors as extractMessages } from '../slices/messagesSlice';
import {
  addChannel,
  removeChannel,
  renameChannel,
  selectors as extractChannels,
} from '../slices/channelsSlice';
import getModal from '../modals/index.js';

const renderModal = (api, handleClose, modals) => {
  if (!modals.action) return null;

  const Component = getModal(modals.action);
  return <Component api={api} handleClose={handleClose} modalsInfo={modals} />;
};

const Chat = () => {
  const { socket, getResult } = useSocket();
  const api = {
    sendMessage: (message) => getResult('newMessage', message),
    addChannel: (channel) => getResult('newChannel', channel),
    renameChannel: (channel) => getResult('renameChannel', channel),
    removeChannel: (channel) => getResult('removeChannel', channel),
  };

  const { currentChannel, setCurrentChannel } = useCurrentChannel();

  console.log(currentChannel);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  filter.loadDictionary('ru');

  const [chatMessage, setMessage] = useState('');
  const [modalsInfo, setModalsInfo] = useState({});

  const currentUser = localStorage.getItem('username');
  const messages = useSelector(extractMessages.selectAll);
  const channels = useSelector(extractChannels.selectAll);

  const currentChannelMessages = messages
    .filter(({ messageChannel }) => messageChannel.name === currentChannel?.name);

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

  const sendMessage = (message) => getResult('newMessage', message);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    const newMessage = {
      message: filter.clean(chatMessage),
      messageChannel: currentChannel.name,
      channelId: currentChannel.id,
      username: currentUser,
    };

    try {
      await sendMessage(newMessage);
    } catch (e) {
      console.log(e);
    }
  };

  const variantMessage = (user) => cn({
    primary: user === currentUser,
    dark: user !== currentUser,
  });

  const handleShow = (evt) => {
    const modal = {
      action: evt.target.dataset.action,
      id: evt.target.dataset.id,
      name: evt.target.dataset.name,
    };

    setModalsInfo(modal);
  };
  const handleClose = () => setModalsInfo({});

  const messagesClassNames = (user) => cn(
    'm-2 p-2 rounded-top-4 rounded-end-4 text-start d-block',
    { 'align-self-end': user === currentUser },
  );

  const classNames = (name) => cn(
    'w-100 rounded-0 text-start text-truncate',
    { 'btn-secondary': name === currentChannel?.name },
  );

  const renderButtonGroup = (name, id) => (
    <li key={id}>
      <Dropdown as={ButtonGroup} className="w-100">
        <Button variant="outline" className={classNames(name)} onClick={() => dispatch(setCurrentChannel({ name, id }))}>
          {`# ${name}`}
        </Button>

        <Dropdown.Toggle
          variant="outline"
          id="dropdown-split-basic"
          className={{ 'btn-secondary': name === currentChannel.name }}
        />

        <Dropdown.Menu>
          <Dropdown.Item
            data-action="removeChannel"
            data-id={id}
            data-name={name}
            onClick={handleShow}
          >
            {t('remove')}
          </Dropdown.Item>
          <Dropdown.Item
            data-action="renameChannel"
            data-id={id}
            data-name={name}
            onClick={handleShow}
          >
            {t('rename')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );

  const renderChannels = () => (
    <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map(({ id, name, removable }) => {
        if (removable) {
          return renderButtonGroup(name, id);
        }
        return (
          <li key={id}>
            <Button variant="outline" className={classNames(name)} onClick={() => dispatch(setCurrentChannel({ name, id }))}>
              {`# ${name}`}
            </Button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Container className="w-75 d-md-block shadow" style={{ height: 800 }}>
      <Row className="row-cols-3">
        <Col
          className="p-4 col-1 fw-bold d-md-block border-bottom border-3 border-light bg-secondary bg-opacity-50"
        >
          <ToastContainer />
          {t('channels')}
        </Col>
        <Col
          className="p-3 col-1 border-end border-bottom border-3 border-light bg-secondary bg-opacity-50"
        >
          <Button
            variant="outside"
            className="mx-3 p-0 bi-plus-square text-primary fs-4"
            data-action="newChannel"
            onClick={handleShow}
          />
        </Col>
        {renderModal(api, handleClose, modalsInfo)}
        <Col
          className="p-3 col-10 border-bottom border-3 border-light bg-secondary bg-opacity-50"
        >
          <span className="fw-bold">{`# ${currentChannel?.name}`}</span>
          <br />
          <span>{`${currentChannelMessages.length} ${t('messages', { count: currentChannelMessages.length })}`}</span>
        </Col>
        <Col
          className="py-4 px-0 col-2 border-end border-3 border-light bg-secondary bg-opacity-50"
          style={{ height: 650 }}
        >
          {renderChannels()}
        </Col>
        <Col className="p-3 col-10 text-start overflow-y-auto" style={{ height: 650, backgroundColor: '#FAFAFA' }}>
          <ListGroup className="d-flex flex-column px-2 mb-3">
            {messages
            && currentChannelMessages.map(({ id, message, username }) => (
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

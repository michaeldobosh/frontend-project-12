import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useImmer } from "use-immer";
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import * as yup from 'yup';
import _ from 'lodash';
import routes from '../routes';
import { useSocket, useAuth } from '../hooks/index.jsx';
import { fetchMessages, addMessage, selectors as storeMessages } from '../slices/messagesSlice';
import { fetchChannels, addChannel, removeChannel, renameChannel, selectors as storeChannels } from '../slices/channelsSlice';
import { fetchUsers, sendUser, removeUser } from '../slices/usersSlice';
import getModal from '../modals/index.js';

const renderModal = (modal, handleChannel, hideModal, current, changeRoom) => {
  if (!modal) return null;

  const Component = getModal(modal);
  return (
    <Component
      handleChannel={handleChannel}
      hideModal={hideModal}
      current={current}
      changeRoom={changeRoom}
    />
  );
};

const Channels = ({ currentRoom, setRoom }) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [modal, setModal] = useState('');
  const [current, setCurrentChannel] = useState({ currentId: null, currentName: '' });

  const messages = useSelector(storeMessages.selectAll);
  const channels = useSelector(storeChannels.selectAll);
  const currentRoomMessage = messages.filter(({ room }) => currentRoom.name === room);

  const changeRoom = (data) => {
    setRoom((draft) => {
      draft.currentRoom = { id: data.id, name: data.name };
    });
  };

  socket.on('newChannel', (data) => {
    dispatch(addChannel(data));
    if (data.username === localStorage.username) {
      changeRoom(data);
    }
  });
  socket.on('renameChannel', (data) => {
    dispatch(renameChannel(data));
    if (currentRoom?.id === data.id) {
      changeRoom(data);
    }
  });
  socket.on('removeChannel', (data) => {
    dispatch(removeChannel(data.id));
    if (currentRoom?.id === data.id) {
      changeRoom({ name: 'general', id: 1 });
    }
  });

  const btnClass = (room) => cn('w-100 rounded-0 text-start text-truncate', { 'btn-secondary': room === currentRoom.name });

  const hideModal = () => setModal(null);

  const handleModal = (evt, name = current.currentName, id = current.currentId) => {
    const type = evt.target.dataset.testid;
    setModal(type);
    setCurrentChannel({ currentId: id, currentName: name });
  };

  const handleChannel = ({ currentId }, name) => {
    const dataChannel = {
      name,
      username: localStorage.getItem('username'),
      id: currentId,
    };

    Promise.resolve(socket.emit(modal, dataChannel));
    setModal(null);
  };

  const renderButtonGroup = (name, id) => (
    <li key={id}>
      <Dropdown as={ButtonGroup} className="w-100">
        <Button variant="outline" className={btnClass(name)} onClick={() => changeRoom({ name, id })}>
          {`# ${name}`}
        </Button>

        <Dropdown.Toggle
          variant="outline"
          id="dropdown-split-basic"
          className={{ 'btn-secondary': name === currentRoom.name }}
        />

        <Dropdown.Menu>
          <Dropdown.Item data-testid="removeChannel" onClick={(evt) => handleModal(evt, name, id)}>{t('remove')}</Dropdown.Item>
          <Dropdown.Item data-testid="renameChannel" onClick={(evt) => handleModal(evt, name, id)}>{t('rename')}</Dropdown.Item>
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
            <Button variant="outline" className={btnClass(name)} onClick={() => changeRoom({ name, id })}>
              {`# ${name}`}
            </Button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
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
        <Button variant="outside" className="mx-3 p-0 bi-clipboard-plus text-primary fs-4" data-testid="newChannel" onClick={handleModal} />
      </Col>
      {renderModal(modal, handleChannel, hideModal, current, changeRoom)}
      <Col
        className="p-3 col-10 border-bottom border-3 border-light"
        style={{ height: 80, backgroundColor: '#DADADA' }}
      >
        <span className="fw-bold">{`# ${currentRoom.name}`}</span>
        <br />
        <span>{`${currentRoomMessage.length} ${t('messages', { count: currentRoomMessage.length })}`}</span>
      </Col>
      <Col
        className="py-4 px-0 col-2 border-end border-3 border-light"
        style={{ height: 620, backgroundColor: '#DADADA' }}
      >
        {renderChannels()}
      </Col>
    </>
  );
};

export default Channels;

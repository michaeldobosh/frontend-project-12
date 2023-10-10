import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col,
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useSocket } from '../hooks/index.jsx';
import { selectors as extractMessages } from '../slices/messagesSlice';
import {
  addChannel,
  removeChannel,
  renameChannel,
  setCurrentChannel,
  selectors as extractChannels,
} from '../slices/channelsSlice';
import getModal from '../modals/index.js';

const renderModal = (api, handleClose, modals) => {
  if (!modals.action) return null;

  const Component = getModal(modals.action);
  return <Component api={api} handleClose={handleClose} modalsInfo={modals} />;
};

const Channels = () => {
  const { socket, getResult } = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [modalsInfo, setModalsInfo] = useState({});

  const defaultChannel = { id: 1, name: 'general' };
  const messages = useSelector(extractMessages.selectAll);
  const channels = useSelector(extractChannels.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannel);
  const currentChannelMessages = messages
    .filter(({ messageChannel }) => currentChannel.name === messageChannel);

  const api = {
    addChannel: (channel) => getResult('newChannel', channel),
    renameChannel: (channel) => getResult('renameChannel', channel),
    removeChannel: (channel) => getResult('removeChannel', channel),
  };

  socket.on('newChannel', (data) => {
    dispatch(addChannel(data));
  });
  socket.on('renameChannel', (data) => {
    dispatch(renameChannel(data));
    if (currentChannel?.id === data.id) {
      dispatch(setCurrentChannel({ id: data.id, name: data.name }));
    }
  });
  socket.on('removeChannel', (data) => {
    dispatch(removeChannel(data.id));
    if (currentChannel?.id === data.id) {
      dispatch(setCurrentChannel(defaultChannel));
    }
  });

  const handleShow = (evt) => {
    const modal = {
      action: evt.target.dataset.action,
      selectedСhannelId: evt.target.dataset.id,
      selectedChannelName: evt.target.dataset.name,
    };

    setModalsInfo(modal);
  };
  const handleClose = () => setModalsInfo({});

  const classNames = (messageChannel) => cn(
    'w-100 rounded-0 text-start text-truncate',
    { 'btn-secondary': messageChannel === currentChannel.name },
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
    <>
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
    </>
  );
};

export default Channels;

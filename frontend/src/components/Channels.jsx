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
import { ToastContainer, toast } from 'react-toastify';
import { useSocket } from '../hooks/index.jsx';
import { selectors as storeMessages } from '../slices/messagesSlice';
import {
  addChannel,
  removeChannel,
  renameChannel,
  setCurrentChannel,
  selectors as storeChannels,
} from '../slices/channelsSlice';
import getModal from '../modals/index.js';

const renderModal = (handleChannel, handleClose, modal) => {
  if (!modal.action) return null;

  const Component = getModal(modal.action);
  return <Component handleChannel={handleChannel} handleClose={handleClose} modal={modal} />;
};

const Channels = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [modalInfo, setModal] = useState({});
  const notify = (message) => toast.success(message);

  const messages = useSelector(storeMessages.selectAll);
  const channels = useSelector(storeChannels.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannel);
  const currentUser = localStorage.getItem('username');

  const currentChannelMessage = messages
    .filter(({ messageChannel }) => currentChannel.name === messageChannel);

  socket.on('newChannel', (data) => {
    dispatch(addChannel(data));
    if (data.username === currentUser) {
      dispatch(setCurrentChannel(data));
    }
  });
  socket.on('renameChannel', (data) => {
    dispatch(renameChannel(data));
    if (currentChannel?.id === data.id) {
      dispatch(setCurrentChannel(data));
    }
  });
  socket.on('removeChannel', (data) => {
    dispatch(removeChannel(data.id));
    if (currentChannel?.id === data.id) {
      dispatch(setCurrentChannel({ name: 'general', id: 1 }));
    }
  });

  const handleShow = (evt) => {
    const modal = {
      action: evt.target.dataset.action,
      id: evt.target.dataset.id,
      name: evt.target.dataset.name,
    };

    setModal(modal);
  };
  const handleClose = () => setModal({});

  const handleChannel = (currentId, name) => {
    const dataChannel = {
      name,
      username: currentUser,
      id: currentId,
    };

    Promise.resolve(socket.emit(modalInfo.action, dataChannel));
    notify(t(modalInfo.action));
  };

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
          className="mx-3 p-0 bi-clipboard-plus text-primary fs-4"
          data-action="newChannel"
          onClick={handleShow}
        />
      </Col>
      {renderModal(handleChannel, handleClose, modalInfo)}
      <Col
        className="p-3 col-10 border-bottom border-3 border-light bg-secondary bg-opacity-50"
      >
        <span className="fw-bold">{`# ${currentChannel?.name}`}</span>
        <br />
        <span>{`${currentChannelMessage.length} ${t('messages', { count: currentChannelMessage.length })}`}</span>
      </Col>
      <Col
        className="py-4 px-0 col-2 border-end border-3 border-light bg-secondary bg-opacity-50"
      >
        {renderChannels()}
      </Col>
    </>
  );
};

export default Channels;

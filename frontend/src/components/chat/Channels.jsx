import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import { setCurrentChannelId } from '../../slices/channelsSlice';
import { useSocket } from '../../hooks/index.jsx';
import renderModal from '../../modals/index.js';

const buttonsStyle = (isCurrent) => cn(
  'w-100 rounded-0 text-start text-truncate',
  { 'btn-secondary': isCurrent },
);

const Channels = () => {
  const { t } = useTranslation();
  const { socketApi } = useSocket();
  const dispatch = useDispatch();

  const [modalsInfo, setModalsInfo] = useState({});
  const currentButton = useRef();
  const { currentChannelId } = useSelector(({ channels }) => channels);
  const channels = useSelector((state) => state.channels.entities);

  useEffect(() => {
    currentButton?.current?.scrollIntoView(false);
  }, [currentChannelId, channels]);

  const handleShow = (evt) => {
    const modal = {
      action: evt.target.dataset.action,
      id: evt.target.dataset.id,
      name: evt.target.dataset.name,
    };

    setModalsInfo(modal);
  };

  const handleClose = () => setModalsInfo({});

  const button = (name, id, isCurrent) => (
    <Button
      variant="outline"
      className={buttonsStyle(isCurrent)}
      onClick={() => dispatch(setCurrentChannelId(id))}
      ref={isCurrent ? currentButton : null}
    >
      {`# ${name}`}
    </Button>
  );

  const renderChannels = () => (
    <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {Object.values(channels).map(({ id, name, removable }) => {
        const isCurrent = id === currentChannelId;
        return removable ? (
          <li key={id}>
            <Dropdown as={ButtonGroup} className="w-100">
              {button(name, id, isCurrent)}
              <Dropdown.Toggle
                variant="outline"
                id="dropdown-split-basic"
                className={{ 'btn-secondary': isCurrent }}
              >
                <span className="visually-hidden">{t('channel_management')}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item data-action="renameChannel" data-id={id} data-name={name} onClick={handleShow}>
                  {t('rename')}
                </Dropdown.Item>
                <Dropdown.Item data-action="removeChannel" data-id={id} data-name={name} onClick={handleShow}>
                  {t('remove')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        ) : (
          <li key={id}>
            {button(name, id, isCurrent)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <Col
      className="px-0 col-4 col-md-3 col-lg-2 flex-column h-100 d-flex border-end border-3 border-light"
      style={{ backgroundColor: '#CFE2FF' }}
    >
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels')}</b>
        <Button
          variant="group-vertical"
          type="button"
          className="p-0 text-primary"
          onClick={handleShow}
        >
          <svg data-action="newChannel" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path data-action="newChannel" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path data-action="newChannel" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">{t('plus')}</span>
        </Button>
      </div>
      {currentChannelId && renderChannels()}
      {renderModal(socketApi, handleClose, modalsInfo)}
    </Col>
  );
};

export default Channels;

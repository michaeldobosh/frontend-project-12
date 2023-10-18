import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import _ from 'lodash';

import { selectors as extractChannels } from '../../slices/channelsSlice';
import { useCurrentChannel } from '../../hooks/index.jsx';

const buttonsStyle = (isCurrent) => cn(
  'w-100 rounded-0 text-start text-truncate',
  { 'btn-secondary': isCurrent },
);

const renderButtonGroup = (handleShow, name, id, t) => {
  const actions = [['removeChannel', 'remove'], ['renameChannel', 'rename']];
  return (
    <Dropdown.Menu>
      <span className="visually-hidden">{t('channel_management')}</span>
      {actions.map(([action, buttonName]) => (
        <Dropdown.Item
          key={_.uniqueId()}
          data-action={action}
          data-id={id}
          data-name={name}
          onClick={handleShow}
        >
          {t(buttonName)}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  );
};

const Channels = ({ handleShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { currentChannel, setCurrentChannel } = useCurrentChannel();
  const channels = useSelector(extractChannels.selectAll);

  const button = (name, id, isCurrent) => (
    <Button variant="outline" className={buttonsStyle(isCurrent)} onClick={() => dispatch(setCurrentChannel({ name, id }))}>
      {`# ${name}`}
    </Button>
  );

  const renderChannels = () => (
    <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map(({ id, name, removable }) => {
        const isCurrent = name === currentChannel.name;
        return removable ? (
          <li key={id}>
            <Dropdown as={ButtonGroup} className="w-100">
              {button(name, id, isCurrent)}
              <Dropdown.Toggle
                variant="outline"
                id="dropdown-split-basic"
                className={{ 'btn-secondary': isCurrent }}
              />
              {renderButtonGroup(handleShow, name, id, t)}
            </Dropdown>
          </li>
        ) : <li key={id}>{button(name, id, isCurrent)}</li>;
      })}
    </ul>
  );

  return (
    <Col
      className="py-4 px-0 col-4 col-md-3 col-lg-2 border-end border-3 border-light"
      style={{ height: 700, backgroundColor: '#CFE2FF' }}
    >
      {currentChannel && renderChannels()}
    </Col>
  );
};

export default Channels;

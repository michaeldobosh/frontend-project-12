import { memo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { ListGroup, Alert } from 'react-bootstrap';

import { selectors } from '../../slices/messagesSlice';
import { useAuth } from '../../hooks/index.jsx';

const MessagesBox = ({ errors }) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const chat = useRef();
  const messageArea = useRef();

  const { currentChannelId } = useSelector(({ channels }) => channels);
  const messages = useSelector(selectors.selectAll);
  const channels = useSelector((state) => state.channels.entities);
  const currentChannelMessages = messages
    .filter(({ messageChannelId }) => messageChannelId === currentChannelId);

  useEffect(() => {
    if (messageArea?.current?.offsetHeight < chat?.current?.offsetHeight) {
      chat?.current?.scrollIntoView(false);
    }
  }, [messages, currentChannelId]);

  const messagesStyles = (postAuthorName) => {
    const isCurrent = postAuthorName === userId.userName;
    return cn({ 'primary align-self-end': isCurrent }, 'secondary');
  };

  return (
    <>
      <div className="mb-4 p-3 shadow-sm-small" style={{ backgroundColor: '#CFE2FF' }}>
        <span className="fw-bold">{`# ${channels[currentChannelId]?.name}`}</span>
        <p className="m-0">{`${currentChannelMessages.length} ${t('messages', { count: currentChannelMessages.length })}`}</p>
      </div>
      <div className="px-5 overflow-y-auto" ref={messageArea}>
        <ListGroup className="d-flex flex-column px-2 mb-3" ref={chat}>
          {currentChannelMessages.map(({ id, message, userName }) => (
            <ListGroup.Item
              key={id}
              variant={messagesStyles(userName)}
              className="w-50 m-1 mb-0 p-2 rounded-top-4 rounded-end-4 text-break"
            >
              <span className="fw-bold">{`${userName}: `}</span>
              {message}
            </ListGroup.Item>
          ))}
          {errors && <Alert variant="danger">{t(errors)}</Alert>}
        </ListGroup>
      </div>
    </>
  );
};

export default memo(MessagesBox);

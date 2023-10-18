import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { ListGroup, Alert } from 'react-bootstrap';

const Messages = ({ messages, error }) => {
  const { t } = useTranslation();
  const currentUser = localStorage.getItem('username');

  const messagesStyles = (username) => {
    const isCurrent = username === currentUser;
    return cn({ 'primary align-self-end': isCurrent }, 'secondary');
  };

  return (
    <ListGroup className="d-flex flex-column px-2 mb-3 overflow-y-auto" style={{ height: 600 }}>
      {messages
        && messages.map(({ id, message, username }) => (
          <ListGroup.Item
            key={id}
            variant={messagesStyles(username)}
            className="w-50 m-1 p-2 rounded-top-4 rounded-end-4"
          >
            <span className="fw-bold">{`${username}: `}</span>
            {message}
          </ListGroup.Item>
        ))}
      {error && <Alert variant="danger">{t(error)}</Alert>}
    </ListGroup>
  );
};

export default Messages;

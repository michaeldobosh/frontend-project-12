import { useTranslation } from 'react-i18next';
import { Col, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

import { useCurrentChannel } from '../../hooks/index.jsx';

const Header = ({ handleShow, messagesCount }) => {
  const { t } = useTranslation();
  const { currentChannel } = useCurrentChannel();

  return (
    <>
      <Col
        className="p-4 col-4 col-md-3 col-lg-2 fw-bold border-bottom border-end border-3 border-light"
        style={{ backgroundColor: '#CFE2FF' }}
      >
        {t('channels')}
        <Button
          variant="outside p-0 ps-3 bi-plus-square text-primary fs-4"
          data-action="newChannel"
          onClick={handleShow}
        >
          <span className="visually-hidden">+</span>
        </Button>
      </Col>
      <Col
        className="p-3 col-8 col-md-9 col-lg-10 border-bottom border-3 border-light"
        style={{ backgroundColor: '#CFE2FF' }}
      >
        <span className="fw-bold">{`# ${currentChannel?.name}`}</span>
        <p className="m-0">{`${messagesCount} ${t('messages', { count: messagesCount })}`}</p>
        <ToastContainer />
      </Col>
    </>
  );
};

export default Header;

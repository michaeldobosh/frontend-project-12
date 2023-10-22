import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Col, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

// import { useCurrentChannel } from '../../hooks/index.jsx';

const Header = ({ handleShow, messagesCount }) => {
  const { t } = useTranslation();
  // const { currentChannel } = useCurrentChannel();
  const { currentChannel } = useSelector((state) => state.channels);

  return (
    <>
      <Col
        className="p-4 col-4 col-md-3 col-lg-2 fw-bold border-bottom border-end border-3 border-light"
        style={{ backgroundColor: '#CFE2FF' }}
      >
        {t('channels')}
        <Button
          variant="outline"
          className="p-0 ms-5 text-primary btn-group-vertical"
          data-action="newChannel"
          onClick={handleShow}
        >
          +
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

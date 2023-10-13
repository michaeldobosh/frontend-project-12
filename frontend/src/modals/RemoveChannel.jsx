import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCurrentChannel } from '../hooks/index.jsx';

const RemoveChannel = ({ api, handleClose, modalsInfo }) => {
  const { t } = useTranslation();
  const { defaultChannel, setCurrentChannel } = useCurrentChannel();
  const dispatch = useDispatch();
  const notify = (message) => toast.success(message);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    await api.removeChannel({ id: modalsInfo.id });
    await dispatch(setCurrentChannel(defaultChannel));
    notify(t(modalsInfo.action));
    handleClose();
  };

  return (
    <Modal show={modalsInfo.action} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('remove_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Text className="fs-5">{t('convinced')}</Form.Text>
          <div className="modal-footer">
            <Button variant="secondary" onClick={handleClose}>{t('cancel')}</Button>
            <Button type="submit" variant="danger">{t('remove')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;

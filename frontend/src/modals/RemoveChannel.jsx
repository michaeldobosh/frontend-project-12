import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Modal,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';
import { useCurrentChannel } from '../hooks/index.jsx';

const RemoveChannel = ({ api, handleClose, modalsInfo }) => {
  const { t } = useTranslation();
  const { defaultChannel, setCurrentChannel } = useCurrentChannel();
  const dispatch = useDispatch();
  const notify = (message) => toast.success(message);
  const [error, setError] = useState('');

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setError('');
    try {
      await api.removeChannel({ id: modalsInfo.id });
      await dispatch(setCurrentChannel(defaultChannel));
      notify(t(modalsInfo.action));
      handleClose();
    } catch (err) {
      setError(err.message.replaceAll(' ', '_'));
    }
  };

  return (
    <Modal show={modalsInfo.action} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('remove_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Text className="fs-5">{t('convinced')}</Form.Text>
          <br />
          {error && (
            <Alert variant="danger" className="mt-2">{t(error)}</Alert>
          )}
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

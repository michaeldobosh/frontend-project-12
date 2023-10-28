import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Modal,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';

const RemoveChannel = ({ socketApi, handleClose, modalsInfo }) => {
  const { t } = useTranslation();

  const notify = (message) => toast.success(message);
  const [errors, setErrors] = useState(false);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setErrors(false);
    try {
      await socketApi.removeChannel({ id: modalsInfo.id });
      notify(t(modalsInfo.action));
      handleClose();
    } catch (error) {
      setErrors(true);
      throw error;
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
          {errors && (
            <Alert variant="danger" className="mt-2">{t('operation_has_timed_out')}</Alert>
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

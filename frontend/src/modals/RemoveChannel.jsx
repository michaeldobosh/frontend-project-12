import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Modal,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';
import { setCurrentChannel } from '../slices/channelsSlice';
// import { useCurrentChannel } from '../hooks/index.jsx';

const RemoveChannel = ({ api, handleClose, modalsInfo }) => {
  const { t } = useTranslation();
  // const { currentChannel, defaultChannel, setCurrentChannel } = useCurrentChannel();
  const { defaultChannel, currentChannel } = useSelector((state) => state.channels);
  const dispatch = useDispatch();
  const notify = (message) => toast.success(message);
  const [errors, setErrors] = useState(false);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setErrors(false);
    try {
      const response = await api.removeChannel({ id: modalsInfo.id });
      console.log(currentChannel.id, +modalsInfo.id);
      if (response.status === 'ok' && currentChannel.id === +modalsInfo.id) {
        dispatch(setCurrentChannel(defaultChannel));
      }
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

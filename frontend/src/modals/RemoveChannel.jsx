import { useTranslation } from 'react-i18next';
import { Modal, Button, Form } from 'react-bootstrap';

const RemoveChannel = ({ handleChannel, handleClose, modal }) => {
  const { t } = useTranslation();

  const onSubmit = (evt) => {
    evt.preventDefault();
    handleChannel(modal.id);
    handleClose();
  };

  return (
    <Modal show={modal.action} onHide={handleClose}>
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

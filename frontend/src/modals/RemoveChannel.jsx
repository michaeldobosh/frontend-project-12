import { useTranslation } from 'react-i18next';
import { Modal, Button, Form } from 'react-bootstrap';

const RemoveChannel = ({ handleChannel, hideModal, current }) => {
  const { t } = useTranslation();

  const onSubmit = (evt) => {
    evt.preventDefault();
    handleChannel(current);
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{t('remove_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Text className="fs-5">{t('convinced')}</Form.Text>
          <div className="modal-footer">
            <Button className="btn-secondary" onClick={hideModal}>{t('cancel')}</Button>
            <Button type="submit" className="btn-danger">{t('remove')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;

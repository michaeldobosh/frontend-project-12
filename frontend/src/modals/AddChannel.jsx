import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik, Form as Forma, Field } from 'formik';
import { selectors } from '../slices/channelsSlice';
import setLocale from '../setLocale';

setLocale();

const AddChannel = ({ handleChannel, handleClose, modal }) => {
  const { t } = useTranslation();

  const channelsNames = useSelector(selectors.selectAll).map((c) => c.name);
  const currentChannel = useSelector((state) => state.channels.currentChannel);

  const validateSchema = yup.object({
    channelName: yup.string().min(3).max(20).required()
      .notOneOf(channelsNames),
  });

  const onSubmit = async ({ channelName }, actions) => {
    try {
      await handleChannel(currentChannel.id, channelName);
      await handleClose();
    } catch (e) {
      await actions.setSubmitting(false);
    }
  };

  return (
    <Modal show={modal.action} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('add_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ channelName: '' }}
          validationSchema={validateSchema}
          onSubmit={onSubmit}
        >
          {({ errors, submitCount }) => (
            <Form as={Forma}>
              <Form.Group controlId="validationCustom01">
                <Form.Control
                  as={Field}
                  autoFocus
                  type="text"
                  name="channelName"
                  className={errors.channelName
                    && submitCount ? 'is-invalid' : null}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.channelName && submitCount ? t(errors.channelName) : null}
                </Form.Control.Feedback>
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('submit')}</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;

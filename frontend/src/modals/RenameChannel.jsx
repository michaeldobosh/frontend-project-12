import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form as Forma, Field } from 'formik';
import { useCurrentChannel } from '../hooks/index.jsx';
import { selectors } from '../slices/channelsSlice';
import setLocale from '../setLocale';

setLocale();

const RenameChannel = ({ api, handleClose, modalsInfo }) => {
  const { t } = useTranslation();
  const { currentChannel, setCurrentChannel } = useCurrentChannel();
  const notify = (message) => toast.success(message);
  const dispatch = useDispatch();

  const channelsNames = useSelector(selectors.selectAll)
    .map((c) => c.name)
    .filter((name) => name !== modalsInfo.name);

  const validateSchema = yup.object({
    name: yup.string().min(3).max(20).required()
      .notOneOf(channelsNames),
  });

  const onSubmit = async ({ name }, actions) => {
    try {
      if (modalsInfo.name === currentChannel.name) {
        dispatch(setCurrentChannel({ id: modalsInfo.id, name }));
      }
      await api.renameChannel({ id: modalsInfo.id, name });
      await handleClose();
      notify(t(modalsInfo.action));
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal show={modalsInfo.action} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('rename_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: modalsInfo.name }}
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
                  name="name"
                  className={errors.name
                    && submitCount ? 'is-invalid' : null}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name && submitCount ? t(errors.name) : null}
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

export default RenameChannel;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form as Forma, Field } from 'formik';
import { useCurrentChannel } from '../hooks/index.jsx';
import { selectors } from '../slices/channelsSlice';
import setLocale from '../setLocale';

setLocale();

const AddChannel = ({ api, handleClose, modalsInfo }) => {
  const { t } = useTranslation();
  const { setCurrentChannel } = useCurrentChannel();
  const notify = (message) => toast.success(message);
  const dispatch = useDispatch();

  const channelsNames = useSelector(selectors.selectAll).map((c) => c.name);
  const [error, setError] = useState('');

  const validateSchema = yup.object({
    name: yup.string().min(3).max(20).required()
      .notOneOf(channelsNames),
  });

  const onSubmit = async (values, actions) => {
    setError('');
    try {
      const response = await api.addChannel({ name: values.name });
      await dispatch(setCurrentChannel(response.data));
      await handleClose();
      notify(t(modalsInfo.action));
    } catch (err) {
      setError(err.message.replaceAll(' ', '_'));
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal show={modalsInfo.action} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('add_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
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
                {error && (
                <Alert variant="danger mt-2">{t(error)}</Alert>
                )}
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

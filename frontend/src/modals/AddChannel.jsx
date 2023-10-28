import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { setCurrentChannelId, selectors } from '../slices/channelsSlice';

const AddChannel = ({ socketApi, handleClose, modalsInfo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notify = (message) => toast.success(message);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const channelsNames = useSelector(selectors.selectAll).map((c) => c.name);
  const [errors, setErrors] = useState(false);

  const validationSchema = yup.object({
    name: yup.string().required()
      .min(3, 'from_3_to_20_characters')
      .max(20, 'from_3_to_20_characters')
      .notOneOf(channelsNames),
  });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, actions) => {
      setErrors(false);
      try {
        const response = await socketApi.addChannel({ name: values.name });
        if (response.status === 'ok') {
          dispatch(setCurrentChannelId(response.data.id));
        }
        handleClose();
        notify(t(modalsInfo.action));
      } catch (err) {
        inputRef.current.select();
        setErrors(true);
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <Modal show={modalsInfo.action} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('add_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              type="text"
              name="name"
              id="name"
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={(formik.errors.name
                && formik.submitCount) || errors ? 'is-invalid' : null}
            />
            <Form.Label htmlFor="name" className="visually-hidden">{t('channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name && formik.submitCount
                ? t(formik.errors.name)
                : t('operation_has_timed_out')}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>{t('cancel')}</Button>
            <Button type="submit" variant="primary">{t('submit')}</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;

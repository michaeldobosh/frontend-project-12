import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect, useState } from 'react';
import {
  Col,
  Image,
  Button,
  Form,
  Spinner,
} from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../routes';
import { useAuth } from '../hooks/index.jsx';
import join from '../img/join.png';

const validationSchema = yup.object().shape({
  username: yup.string().required().trim()
    .min(3, 'from_3_to_20_characters')
    .max(20, 'from_3_to_20_characters'),
  password: yup.string().min(6).required().trim(),
  confirm: yup.string().oneOf([yup.ref('password')]),
});

const SignupPage = () => {
  const sendButton = useRef();
  const inputRef = useRef();
  const { t } = useTranslation();
  const auth = useAuth();

  const [errors, setErrors] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      setErrors(false);
      sendButton.current.disabled = true;
      const path = routes.signupPath();
      try {
        const { data: { token } } = await axios.post(path, values);
        localStorage.setItem('username', values.username);
        auth.logIn(token);
      } catch (error) {
        sendButton.current.disabled = false;
        actions.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 409) {
          inputRef.current.select();
          setErrors(true);
        }
        throw error;
      }
    },
  });

  const showErrors = (fieldName) => {
    if (formik.errors[fieldName] && formik.touched[fieldName]) {
      return (
        <Form.Text className="invalid-tooltip m-0">
          {t(formik.errors[fieldName])}
        </Form.Text>
      );
    }
    return null;
  };

  return (
    <>
      <Col><Image src={join} alt="chat" className="w-100" /></Col>
      <Col>
        <Form onSubmit={formik.handleSubmit}>
          <h1 className="fs-1 text-center">{t('reg')}</h1>
          <Form.Group className="form-floating mb-3">
            <Form.Control
              name="username"
              id="username"
              ref={inputRef}
              required
              autoComplete="username"
              placeholder={t('from_3_to_20_characters')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className={(formik.errors.username
                && formik.touched.username) || errors ? 'is-invalid' : null}
            />
            <Form.Label htmlFor="username">{t('username')}</Form.Label>
            {showErrors('username')}
          </Form.Group>

          <Form.Group className="form-floating mb-3">
            <Form.Control
              name="password"
              id="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder={t('min_6')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={(formik.errors.password
                && formik.touched.password) || errors ? 'is-invalid' : null}
            />
            <Form.Label htmlFor="password">{t('password')}</Form.Label>
            {showErrors('password')}
          </Form.Group>

          <Form.Group className="form-floating mb-3">
            <Form.Control
              name="confirm"
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              placeholder={t('password_mismatch')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirm}
              className={(formik.errors.confirm
                && formik.touched.confirm) || errors ? 'is-invalid' : null}
            />
            <Form.Label htmlFor="confirm">{t('password_conf')}</Form.Label>
            {formik.errors.confirm
              ? showErrors('confirm')
              : <Form.Text className="invalid-tooltip m-0">{t('already_exists')}</Form.Text>}
          </Form.Group>
          <Button variant="outline-primary" className="mt-4 w-100 rounded-1" type="submit" ref={sendButton}>
            {formik.isSubmitting
              && (
              <Spinner animation="border" role="status" className="position-absolute">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              )}
            {t('signup')}
          </Button>
        </Form>
      </Col>
    </>
  );
};

export default SignupPage;

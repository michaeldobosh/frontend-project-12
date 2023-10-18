import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect, useState } from 'react';
import {
  Col,
  Image,
  Button,
  Form,
} from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../routes';
import { useAuth } from '../hooks/index.jsx';
import setLocale from '../setLocale';
import chat from '../img/web-chat.png';

setLocale();

const validationSchema = yup.object().shape({
  username: yup.string().required().trim(),
  password: yup.string().required().trim(),
});

const LoginPage = () => {
  const sendButton = useRef();
  const inputRef = useRef();
  const auth = useAuth();
  const { t } = useTranslation();

  const [errors, setErrors] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      sendButton.current.disabled = true;
      try {
        const path = routes.loginPath();
        const { data: { token } } = await axios.post(path, values);
        localStorage.setItem('userId', JSON.stringify({ token }));
        localStorage.setItem('username', values.username);
        auth.logIn(token);
      } catch (error) {
        sendButton.current.disabled = false;
        actions.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 401) {
          inputRef.current.select();
          setErrors(true);
        }
        throw error;
      }
    },
  });

  return (
    <>
      <Col><Image src={chat} alt="chat" className="w-100" /></Col>
      <Col>
        <Form onSubmit={formik.handleSubmit}>
          <h1 className="fs-1 text-center">{t('enter')}</h1>

          <Form.Group className="form-floating mb-3">
            <Form.Control
              type="text"
              required
              ref={inputRef}
              placeholder={t('your_nickname')}
              name="username"
              id="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className={(formik.errors.username
                && formik.touched.username) || errors ? 'is-invalid' : null}
            />
            <Form.Label htmlFor="username">{t('your_nickname')}</Form.Label>
            <Form.Text className="invalid-tooltip m-0">
              {formik.errors.username ? t(formik.errors.username) : null}
            </Form.Text>
          </Form.Group>

          <Form.Group className="form-floating mb-3">
            <Form.Control
              type="password"
              required
              placeholder={t('password')}
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={(formik.errors.password
                && formik.touched.password) || errors ? 'is-invalid' : null}
            />
            <Form.Label htmlFor="password">{t('password')}</Form.Label>
            <Form.Text className="invalid-tooltip m-0">
              {formik.errors.password
                ? t(formik.errors.password)
                : t('invalid_username_or_password')}
            </Form.Text>
          </Form.Group>
          <Button type="submit" variant="outline-primary" className="mt-4 w-100 rounded-1" ref={sendButton}>
            <i className="bi bi-box-arrow-in-right" />
            { t('enter')}
          </Button>
        </Form>
      </Col>
    </>
  );
};

export default LoginPage;

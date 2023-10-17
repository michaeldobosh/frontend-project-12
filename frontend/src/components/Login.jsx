import axios from 'axios';
import { Formik, Form as Forma, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
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
const timeout = 10000;

const validateForm = yup.object().shape({
  username: yup.string().required().trim(),
  password: yup.string().required().trim(),
});

const LoginPage = () => {
  const sendButton = useRef();
  const auth = useAuth();
  const { t } = useTranslation();

  const onSubmit = async (values, actions) => {
    sendButton.current.disabled = true;
    try {
      const path = routes.loginPath();
      const { data: { token } } = await axios.post(path, values, { timeout });
      localStorage.setItem('userId', JSON.stringify({ token }));
      localStorage.setItem('username', values.username);
      auth.logIn(token);
    } catch (e) {
      sendButton.current.disabled = false;
      actions.setSubmitting(false);
      if (e.isAxiosError && e.response.status === 401) {
        const error = e.message.replaceAll(' ', '_').toLowerCase();
        actions.setErrors({ username: ' ', password: error });
      }
    }
  };

  return (
    <>
      <Col><Image src={chat} alt="chat" className="w-100" /></Col>
      <Col>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validateForm}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => {
            const showErrors = (fieldName) => {
              if (errors[fieldName]?.trim() && touched[fieldName]) {
                return (
                  <Form.Text className="invalid-tooltip m-0">
                    {t(errors[fieldName])}
                  </Form.Text>
                );
              }
              return null;
            };

            return (
              <Form as={Forma}>
                <Form.Text className="fs-1 text-center">{t('enter')}</Form.Text>

                <Form.Floating className="mb-3">
                  <Form.Control
                    as={Field}
                    autoFocus
                    type="text"
                    placeholder={t('your_nickname')}
                    name="username"
                    className={errors.username
                      && touched.username ? 'is-invalid' : null}
                  />
                  <Form.Label htmlFor="username">{t('your_nickname')}</Form.Label>
                  {showErrors('username')}
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control
                    as={Field}
                    type="password"
                    placeholder={t('password')}
                    name="password"
                    className={errors.password
                      && touched.password ? 'is-invalid' : null}
                  />
                  <Form.Label htmlFor="password">{t('password')}</Form.Label>
                  {showErrors('password')}
                </Form.Floating>
                <Button type="submit" variant="outline-primary" className="mt-4 w-100 rounded-1" ref={sendButton}>
                  <i className="bi bi-box-arrow-in-right" />
                  { t('submit')}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Col>
    </>
  );
};

export default LoginPage;

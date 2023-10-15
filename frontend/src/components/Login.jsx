import axios from 'axios';
import { Formik, Form as Forma, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
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

const validateForm = yup.object().shape({
  username: yup.string().required().trim(),
  password: yup.string().required().trim(),
});

const LoginPage = () => {
  const auth = useAuth();
  const [{ isAuthError, errorText }, setAuthError] = useState({ isAuthError: false, errorText: '' });
  const { t } = useTranslation();

  const onSubmit = async (values, actions) => {
    setAuthError(false);
    try {
      const path = routes.loginPath();
      const { data: { token } } = await axios.post(path, values);
      localStorage.setItem('userId', JSON.stringify({ token }));
      localStorage.setItem('username', values.username);
      auth.logIn(token);
    } catch (error) {
      actions.setSubmitting(false);
      if (error.isAxiosError && error.response.status === 401) {
        setAuthError({
          isAuthError: true,
          errorText: error.message
            .replaceAll(' ', '_').toLowerCase(),
        });
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
              if (errors[fieldName] && touched[fieldName]) {
                return (
                  <Form.Text className="position-absolute top-25 start-25 px-3 py-1 bg-danger rounded-1 text-white opacity-75">
                    {t(errors[fieldName])}
                  </Form.Text>
                );
              }
              return null;
            };

            return (
              <Form as={Forma}>
                <Form.Text className="fs-1 text-center">{t('enter')}</Form.Text>

                <Form.Group controlId="formBasicName" className="pb-2">
                  <Form.Label />
                  <Form.Control
                    as={Field}
                    type="text"
                    placeholder={t('your_nickname')}
                    name="username"
                    className={errors.username
                      && touched.username ? 'is-invalid' : null}
                  />
                  {showErrors('username')}
                </Form.Group>

                <Form.Group controlId="exampleInputPassword" className="pb-2">
                  <Form.Label />
                  <Form.Control
                    as={Field}
                    type="password"
                    placeholder={t('password')}
                    name="password"
                    className={errors.password
                      && touched.password ? 'is-invalid' : null}
                  />
                  {showErrors('password')}
                </Form.Group>

                {isAuthError
                && <Form.Text className="text-danger fs-6">{t(errorText)}</Form.Text>}
                <Button type="submit" variant="outline-primary" className="mt-4 w-100 rounded-1">
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

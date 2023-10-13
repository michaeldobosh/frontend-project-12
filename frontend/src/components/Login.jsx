import axios from 'axios';
import { Formik, Form as Forma, Field } from 'formik';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Navbar,
  Image,
  Button,
  Form,
} from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../routes';
import { useAuth } from '../hooks/index.jsx';
import setLocale from '../setLocale';
import Version from './Version';
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

  const base = routes.baseUrl();
  const path = routes.loginPath();
  const url = new URL(path, base);

  const onSubmit = async (values, actions) => {
    try {
      const { data: { token } } = await axios.post(url.toString(), values);
      localStorage.setItem('userId', JSON.stringify({ token }));
      localStorage.setItem('username', values.username);
      auth.logIn(values.username);
      setAuthError(false);
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
      <Container className="bg-light border border-2 w-50 p-1 pr-5">
        <Version />
        <Row className="mt-3 mb-5">
          <Col md="6" className="m-4 position-relative">
            <Image src={chat} alt="chat" className="w-100" />
          </Col>
          <Col md="5" className="position-relative">
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
        </Row>
      </Container>
      <Navbar className="fixed-bottom" collapseOnSelect bg="light" expand="lg">
        <Container className="d-block w-50">
          <Row>
            <Col className="p-0 d-flex justify-content-center">
              <Navbar.Brand>{t('no_account')}</Navbar.Brand>
              <Button as={Link} variant="outline-secondary" to="/signup" className="ms-3">{t('reg')}</Button>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </>
  );
};

export default LoginPage;

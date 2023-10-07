import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
} from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../routes';
import { useAuth } from '../hooks/index.jsx';
import chat from '../web-chat.png';

const validateForm = yup.object().shape({
  username: yup.string().matches(/[a-zA-Z]/).required().trim(),
  password: yup.string().matches(/[a-zA-Z]/).required().trim(),
});

const LoginPage = () => {
  const auth = useAuth();
  const [{ authError, errorText }, setAuthError] = useState({ authError: false, errorText: '' });
  const { t } = useTranslation();

  const onSubmit = async (values, actions) => {
    try {
      const path = await routes.loginPath();
      const { data: { token } } = await axios.post(path, values);
      localStorage.setItem('userId', JSON.stringify({ token }));
      localStorage.setItem('username', values.username);
      auth.logIn();
      setAuthError(false);
    } catch (error) {
      actions.setSubmitting(false);
      if (error.isAxiosError && error.response.status === 401) {
        setAuthError({ authError: true, errorText: error.message
          .replaceAll(' ', '_').toLowerCase() });
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validateForm}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Container className="bg-light border border-2 w-50 p-3 pr-5">
            <Row className="text-center mt-5 mb-5">
              <Col md="6" className="m-4">
                <img src={chat} alt="chat" className="w-100" />
              </Col>
              <Col md="5">
                <Form>
                  <fieldset>
                    <legend>{t('enter')}</legend>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="exampleInputName" />
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-person" /></span>
                        <Field
                          type="username"
                          name="username"
                          className="form-control"
                          id="exampleInputName"
                          autoComplete="username"
                          placeholder={t('your_nickname')}
                        />
                      </div>
                      {errors.username && touched.username ? (
                        <div id="usernameHelp" className="form-text">
                          {t(errors.username.replaceAll(' ', '_').split(':')[0])}
                        </div>
                      ) : null}
                      <label htmlFor="exampleInputPassword" className="form-label" />
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-lock" /></span>
                        <Field
                          type="password"
                          name="password"
                          className="form-control"
                          id="exampleInputPassword"
                          autoComplete="password"
                          placeholder={t('password')}
                        />
                      </div>
                      {errors.password && touched.password ? (
                        <div id="passwordHelp" className="form-text">
                          {t(errors.password.replaceAll(' ', '_').split(':')[0])}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <span>{authError && t(errorText)}</span>
                    </div>
                    <button type="submit" className="w-100 mb-3 btn btn-outline-primary">
                      <i className="bi bi-box-arrow-in-right" />
                      { t('submit')}
                    </button>
                  </fieldset>
                </Form>
              </Col>
              <Col />
            </Row>
            <Row />
          </Container>
        )}
      </Formik>
      <Navbar className="fixed-bottom navbar-dark bg-light ps-5">
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav>
            <Navbar.Text className="text-dark align-center">Нет аккаунта?</Navbar.Text>
          </Nav>
          <Nav className="mr-auto">
            <Button as={Link} to="/signup" className="ms-3">Регистрация</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default LoginPage;

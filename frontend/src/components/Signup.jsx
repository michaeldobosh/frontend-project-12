import axios from 'axios';
import { Formik, Form as Forma, Field } from 'formik';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
} from 'react-bootstrap';
import * as yup from 'yup';
import { setLocale } from 'yup';
import cn from 'classnames';
import routes from '../routes';
import { useAuth } from '../hooks/index.jsx';
import join from '../join.png';

setLocale({
  mixed: {
    default: 'Ошибка валидации',
    required: 'is_a_required_field',
    oneOf: 'password_mismatch',
  },
  string: {
    min: 'min_${min}',
    max: 'max_${max}',
  },
});

const validateForm = yup.object().shape({
  username: yup.string().min(3).max(20).required()
    .trim(),
  password: yup.string().min(6).required().trim(),
  confirm: yup.string().oneOf([yup.ref('password')]).required(),
});

const Registration = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [{ signUpError, errorText }, setSignUpError] = useState({ signUpError: false, errorText: '' });

  const onSubmit = async (values, actions) => {
    const path = await routes.signupPath();
    try {
      const { data: { token } } = await axios.post(path, values);
      localStorage.setItem('userId', JSON.stringify({ token }));
      localStorage.setItem('username', values.username);
      auth.logIn();
      setSignUpError(false);
    } catch (error) {
      actions.setSubmitting(false);
      if (error.isAxiosError && error.response.status === 409) {
        setSignUpError({
          signUpError: true,
          errorText: error.message
            .replaceAll(' ', '_').toLowerCase(),
        });
      }
    }
  };

  return (
    <Container className="p-5 bg-light border border-2 w-50">
      <Row>
        <Col md="6">
          <Image src={join} alt="chat" className="w-100" />
        </Col>
        <Col md="5">
          <Formik
            initialValues={{
              username: '',
              password: '',
              confirm: '',
            }}
            validationSchema={validateForm}
            onSubmit={onSubmit}
          >
            {({ errors, touched }) => {
              const showErrors = (fieldName) => {
                if (errors[fieldName] && touched[fieldName]) {
                  return (
                    <Form.Text className="text-danger fs-5">
                      {t(errors[fieldName])}
                    </Form.Text>
                  );
                }
                return null;
              };

              return (
                <Form as={Forma}>
                  <Form.Text className="fs-1 text-center">{t('reg')}</Form.Text>
                  <Form.Group controlId="formBasicEmail">
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

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label />
                    <Form.Control
                      as={Field}
                      name="password"
                      type="password"
                      autoComplete="password"
                      placeholder={t('password')}
                      className={errors.password
                        && touched.password ? 'is-invalid' : null}
                    />
                    {showErrors('password')}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicconfirm">
                    <Form.Label />
                    <Form.Control
                      as={Field}
                      name="confirm"
                      type="password"
                      placeholder={t('password_conf')}
                      className={errors.confirm
                        && touched.confirm ? 'is-invalid' : null}
                    />
                    {showErrors('confirm')}
                  </Form.Group>
                  {signUpError
                  && <Form.Text className="text-danger fs-5">{t(errorText)}</Form.Text>}
                  <Button variant="outline-primary" className="mt-3 w-100 rounded-1" type="submit">
                    {t('signup')}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;

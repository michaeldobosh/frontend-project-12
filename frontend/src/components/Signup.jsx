import axios from 'axios';
import { Formik, Form as Forma, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
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
import join from '../img/join.png';

setLocale();
const timeout = 10000;

const validateForm = yup.object().shape({
  username: yup.string().required().trim()
    .test('username', 'from_3_to_20_characters', (value) => value?.length >= 3 && value?.length <= 20),
  password: yup.string().min(6).required().trim(),
  confirm: yup.string().oneOf([yup.ref('password')]).required(),
});

const Registration = () => {
  const sendButton = useRef();
  const { t } = useTranslation();
  const auth = useAuth();

  const [{ signUpError, errorText }, setSignUpError] = useState({ signUpError: false, errorText: '' });

  const onSubmit = async (values, actions) => {
    setSignUpError(false);
    sendButton.current.disabled = true;
    const path = await routes.signupPath();
    try {
      const { data: { token } } = await axios.post(path, values, { timeout });
      localStorage.setItem('userId', JSON.stringify({ token }));
      localStorage.setItem('username', values.username);
      auth.logIn();
      setSignUpError(false);
    } catch (error) {
      sendButton.current.disabled = false;
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
    <>
      <Col><Image src={join} alt="chat" className="w-100" /></Col>
      <Col>
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
                  <Form.Text className="position-absolute top-25 start-25 px-3 py-1 bg-danger rounded-1 text-white opacity-75">
                    {t(errors[fieldName])}
                  </Form.Text>
                );
              }
              return null;
            };

            return (
              <Form as={Forma}>
                <Form.Text className="fs-1 text-center">{t('reg')}</Form.Text>
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

                <Form.Group controlId="formBasicPassword" className="pb-2">
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

                <Form.Group controlId="formBasicconfirm" className="pb-2">
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
                && <Form.Text className="text-danger fs-6">{t(errorText)}</Form.Text>}
                <Button variant="outline-primary" className="mt-4 w-100 rounded-1" type="submit" ref={sendButton}>
                  {t('signup')}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Col>
    </>
  );
};

export default Registration;

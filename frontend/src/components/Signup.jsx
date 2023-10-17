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
import join from '../img/join.png';

setLocale();
const timeout = 10000;

const validateForm = yup.object().shape({
  username: yup.string().required().trim()
    .test('username', 'from_3_to_20_characters', async (value) => await value?.length > 2 && value?.length < 21),
  password: yup.string().min(6).required().trim(),
  confirm: yup.string().oneOf([yup.ref('password')]).required(),
});

const Registration = () => {
  const sendButton = useRef();
  const { t } = useTranslation();
  const auth = useAuth();

  const onSubmit = async (values, actions) => {
    sendButton.current.disabled = true;
    const path = await routes.signupPath();
    try {
      const { data: { token } } = await axios.post(path, values, { timeout });
      localStorage.setItem('userId', JSON.stringify({ token }));
      localStorage.setItem('username', values.username);
      auth.logIn();
    } catch (e) {
      sendButton.current.disabled = false;
      actions.setSubmitting(false);
      if (e.isAxiosError && e.response.status === 409) {
        const error = e.message.replaceAll(' ', '_').toLowerCase();
        actions.setErrors({ username: ' ', password: ' ', confirm: error });
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
                <Form.Text className="fs-1 text-center">{t('reg')}</Form.Text>
                <Form.Floating className="mb-3">
                  <Form.Control
                    as={Field}
                    autoFocus
                    autoComplete="username"
                    placeholder={t('from_3_to_20_characters')}
                    name="username"
                    className={errors.username
                      && touched.username ? 'is-invalid' : null}
                  />
                  <Form.Label htmlFor="username">{t('username')}</Form.Label>
                  {showErrors('username')}
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control
                    as={Field}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t('min_6')}
                    className={errors.password
                      && touched.password ? 'is-invalid' : null}
                  />
                  <Form.Label htmlFor="password">{t('password')}</Form.Label>
                  {showErrors('password')}
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control
                    as={Field}
                    name="confirm"
                    type="password"
                    placeholder={t('password_mismatch')}
                    className={errors.confirm
                      && touched.confirm ? 'is-invalid' : null}
                  />
                  <Form.Label htmlFor="confirm">{t('password_conf')}</Form.Label>
                  {showErrors('confirm')}
                </Form.Floating>
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

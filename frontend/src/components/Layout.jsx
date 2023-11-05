import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
} from 'react-bootstrap';
import { setLocale } from 'yup';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes';

/* eslint-disable */
setLocale({
  mixed: {
    default: 'dafault',
    required: 'is_a_required_field',
    oneOf: 'password_mismatch',
    notOneOf: 'must_be_unique',
  },
  string: {
    min: 'min_${min}',
  },
});

const AuthButton = () => {
  const { t } = useTranslation();
  const { userId, logOut } = useAuth();
  const location = useLocation();

  return (
    userId?.token
      ? <Button onClick={logOut} variant="outline-secondary">{t('log_out')}</Button>
      : <Button as={Link} variant="outline-secondary" to={routes.loginPage} state={{ from: location }}>{t('log_in')}</Button>
  );
};

const Layout = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm" collapseOnSelect bg="light" expand="lg">
        <Container className="d-block w-75">
          <Row>
            <Col className="p-0 d-flex justify-content-between">
              <Navbar.Brand as={Link} to="/">{t('brand_badge')}</Navbar.Brand>
              <AuthButton />
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Outlet />
      </div>
    </div>
  );
};

export default Layout;

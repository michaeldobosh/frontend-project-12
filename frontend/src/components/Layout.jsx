import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
} from 'react-bootstrap';
import { useAuth } from '../hooks/index.jsx';

const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} variant="outline-secondary">{t('log_out')}</Button>
      : <Button as={Link} variant="outline-secondary" to="login" state={{ from: location }}>{t('log_in')}</Button>
  );
};

const Layout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Navbar className="mb-5" collapseOnSelect bg="light" expand="lg">
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
    </>
  );
};

export default Layout;

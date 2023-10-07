import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
  Nav,
} from 'react-bootstrap';
import { useAuth } from '../hooks/index.jsx';

const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('log_out')}</Button>
      : <Button as={Link} to="login" state={{ from: location }}>{t('log_in')}</Button>
  );
};

const Layout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Navbar className="ps-3" collapseOnSelect bg="light" expand="lg">
        <Navbar.Brand className="col-6 text-center" as={Link} to="/">{t('my_first_chat')}</Navbar.Brand>
        <Col className="col-2" />
        <Nav className="col-1">
          <AuthButton />
        </Nav>
      </Navbar>
      <Container>
        <Row className="mt-4">
          <Col md="5" />
        </Row>
      </Container>
      <Outlet />
    </>
  );
};

export default Layout;

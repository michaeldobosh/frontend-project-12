import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
} from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FormContainer = () => {
  const { t, i18n } = useTranslation();

  const handleLangSwitch = (e) => {
    const { lang } = e.target.dataset;
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
          <Col md="9" lg="8" xl="7" xxl="6" className="border border-2 pb-5 pe-5 ps-5 pt-2">
            <Row className="pb-5">
              <Col>
                {t('site_version')}
                <Button variant="outline-secondary py-0 " data-lang="en" onClick={handleLangSwitch}>{t('english')}</Button>
                <span className="mx-2">|</span>
                <Button variant="outline-secondary py-0" data-lang="ru" onClick={handleLangSwitch}>{t('russian')}</Button>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2">
              <Outlet />
            </Row>
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

export default FormContainer;

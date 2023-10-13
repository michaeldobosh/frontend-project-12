import { Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Version = () => {
  const { t, i18n } = useTranslation();

  const handleLangSwitch = (e) => {
    const { lang } = e.target.dataset;
    i18n.changeLanguage(lang);
  };

  return (
    <Row className="px-2 w-50 d-flex justify-content-start">
      <Col md="3 px-1">{t('site_version')}</Col>
      <Col className="col-2 px-0">
        <Button variant="outline-secondary py-0 " data-lang="en" onClick={handleLangSwitch}>{t('english')}</Button>
      </Col>
      <Col md="1 px-0">|</Col>
      <Col className="col-1 px-0">
        <Button variant="outline-secondary py-0" data-lang="ru" onClick={handleLangSwitch}>{t('russian')}</Button>
      </Col>
    </Row>
  );
};

export default Version;

import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Version = () => {
  const { t, i18n } = useTranslation();

  const handleLangSwitch = (e) => {
    const { lang } = e.target.dataset;
    i18n.changeLanguage(lang);
  };

  return (
    <Row className="px-2 w-25 d-flex justify-content-around">
      <Col md="7">{t('site_version')}</Col>
      <Col className="col-2">
        <Link to="index" as={Button} data-lang="en" onClick={handleLangSwitch}>{t('english')}</Link>
      </Col>
      <Col md="1">|</Col>
      <Col className="col-1">
        <Link to="index" as={Button} data-lang="ru" onClick={handleLangSwitch}>{t('russian')}</Link>
      </Col>
    </Row>
  );
};

export default Version;

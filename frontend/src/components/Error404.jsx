import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Image,
  Button,
} from 'react-bootstrap';
import error404 from '../img/error404.png';

const Error = () => {
  const { t } = useTranslation();

  return (
    <Container className="d-block w-50">
      <Row>
        <Col>
          <Image src={error404} className="w-100" alt="Error 404" />
        </Col>
      </Row>
      <Row>
        <Col className="text-center p-2">
          <h2>{t('page_not_found')}</h2>
          <p>{t('we_cant_find_the_page')}</p>
          <Button as={Link} variant="outline-secondary w-25" to="/">{t('return_to_chat')}</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Error;

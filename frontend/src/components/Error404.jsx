// import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import error404 from '../404-2.jpg';
import '../App.css';

const Error = () => (
  <div className="App">
    <header className="App-header">
      <img src={error404} className="404" alt="404" />
      <h2>Страница не найдена</h2>
      <div>
        <p>Мы не можем найти страницу, которую вы ищите.</p>
        <p>Она может быть еще не зарегистрирована или её не существует</p>
      </div>
      <Link to="/">Вернуться на главную</Link>
      <br />
    </header>
  </div>
);

export default Error;

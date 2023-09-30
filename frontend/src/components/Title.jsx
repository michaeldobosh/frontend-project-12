import { Link, Outlet } from 'react-router-dom';
// import logo from '../logo.svg';
import '../App.css';

const Title = () => (
  <div className="App">
    <header className="App-header">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <p>Edit src/App.js and save to reload.</p>
      <Link to="login">Авторизация</Link>
      <Link to="*">Error</Link>
      <Link to="/">Home</Link>
      <Outlet />
    </header>
  </div>
);

export default Title;

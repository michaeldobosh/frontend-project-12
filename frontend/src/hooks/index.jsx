import { useContext } from 'react';
import UserContext from '../contexts/index.jsx';

const useAuth = () => useContext(UserContext);
export default useAuth;

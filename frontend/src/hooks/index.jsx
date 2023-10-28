import { useContext } from 'react';
import { UserContext, SocketContext } from '../contexts/index.jsx';

export const useAuth = () => useContext(UserContext);
export const useSocket = () => useContext(SocketContext);

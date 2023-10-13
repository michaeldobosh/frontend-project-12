import { useContext } from 'react';
import { UserContext, SocketContext, CurrentChannel } from '../contexts/index.jsx';

export const useAuth = () => useContext(UserContext);
export const useSocket = () => useContext(SocketContext);
export const useCurrentChannel = () => useContext(CurrentChannel);

import { useContext } from 'react';
import { AuthContext } from '@/contexts/Auth.context';

const useAuth = () => useContext(AuthContext);

export default useAuth;

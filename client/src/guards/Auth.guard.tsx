import { ReactNode, Fragment } from 'react';
import { Loading } from '@/components';
import useAuth from '@/hooks/useAuth.hook';
import useModal from '@/hooks/useModal';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props;
  const { isInitialized, isAuthenticated } = useAuth();
  const { openModal } = useModal();

  if (!isInitialized) {
    return <Loading />;
  }

  if (isInitialized && !isAuthenticated) {
    openModal({
      key: 'authentication',
      params: {
        beClosed: false,
      },
    });
    return null;
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthGuard;

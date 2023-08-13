import Modal from '@/components/Modal.component';
import useAuth from '@/hooks/useAuth.hook';
import MainLayout from '@/layouts/main';
import ThemeConfig from '@/theme';
import { AppProps } from 'next/app';

const AppWrapper = ({ Component, pageProps }: AppProps) => {
  const { isInitialized } = useAuth();
  return isInitialized ? (
    <ThemeConfig>
      <Modal />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ThemeConfig>
  ) : (
    <div>Loading...</div>
  );
};

export default AppWrapper;

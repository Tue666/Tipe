import '@/theme/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Providers from './_providers';
import ThemeConfig from '@/theme';
import Modal from '@/components/Modal.component';
import MainLayout from '@/layouts/main';

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface AppPropsWithLayout extends AppProps {
  Component: PageWithLayout;
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);
  return (
    <Providers>
      <ThemeConfig>
        <Modal />
        {getLayout(<Component {...pageProps} />)}
      </ThemeConfig>
    </Providers>
  );
};

export default App;

import '@/theme/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Providers from './_providers';
import ThemeConfig from '@/theme';
import { Modal } from '@/components';
import SnackbarUtilsConfiguration from '@/hooks/useSnackbar';
import MainLayout from '@/layouts/main';

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface AppPropsWithLayout extends AppProps {
  Component: PageWithLayout;
}

const App = (props: AppPropsWithLayout) => {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);
  return (
    <Providers>
      <ThemeConfig>
        <Modal />
        <SnackbarUtilsConfiguration />
        {getLayout(<Component {...pageProps} />)}
      </ThemeConfig>
    </Providers>
  );
};

export default App;

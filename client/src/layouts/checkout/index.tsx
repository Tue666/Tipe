import { ReactNode, Fragment } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container } from '@mui/material';

interface CheckoutLayoutProps {
  children: ReactNode;
}

const CheckoutLayout = (props: CheckoutLayoutProps) => {
  const { children } = props;
  return (
    <Fragment>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </Fragment>
  );
};

export default CheckoutLayout;

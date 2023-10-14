import { ReactNode, Fragment } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container } from '@mui/material';
import { AuthGuard } from '@/guards';

interface CheckoutLayoutProps {
  children: ReactNode;
  hasGuard?: boolean;
}

const CheckoutLayout = (props: CheckoutLayoutProps) => {
  const { children, hasGuard = false } = props;
  const renderLayout = () => {
    return (
      <Fragment>
        <Header />
        <Container>{children}</Container>
        <Footer />
      </Fragment>
    );
  };

  if (hasGuard) {
    return <AuthGuard>{renderLayout()}</AuthGuard>;
  }

  return renderLayout();
};

export default CheckoutLayout;

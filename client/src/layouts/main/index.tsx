import { ReactNode, Fragment } from 'react';
import { Container } from '@/components/overrides';
import Header from './Header';
import Footer from './Footer';
import { AuthGuard } from '@/guards';

interface MainLayoutProps {
  children: ReactNode;
  hasGuard?: boolean;
}

const MainLayout = (props: MainLayoutProps) => {
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

export default MainLayout;

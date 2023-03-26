import { ReactNode, Fragment } from "react";
import { Container } from "@mui/material";

//
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Fragment>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </Fragment>
  );
};

export default MainLayout;

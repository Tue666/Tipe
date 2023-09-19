import { Fragment, ReactNode } from 'react';
import Head from 'next/head';

interface PageProps {
  title?: string;
  children: ReactNode;
}

const Page = (props: PageProps) => {
  const { title, children } = props;
  return (
    <Fragment>
      {/* For SEO like title, meta, ... tags */}
      <Head>{title && <title>{title}</title>}</Head>
      {children}
    </Fragment>
  );
};

export default Page;

// import { GetStaticPaths, GetStaticProps } from 'next';

import { Fragment } from 'react';
import { Stack } from '@mui/material';
import { Breadcrumbs, Page, Teleport } from '@/components';

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   };
// };

// export const getStaticProps: GetStaticProps = async (context) => {
//   const { params } = context;
//   console.log(params);
//   return {
//     props: {},
//   };
// };

const Category = () => {
  return (
    <Page title="Buy online at good price | Tipe Shop">
      <Teleport />
      <Fragment>
        <Breadcrumbs />
        <Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
          hihi
        </Stack>
      </Fragment>
    </Page>
  );
};

export default Category;

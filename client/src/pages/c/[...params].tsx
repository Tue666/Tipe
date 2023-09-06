import _ from 'lodash';
import { Fragment } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Stack } from '@mui/material';
import { Breadcrumbs, Page, Teleport } from '@/components';
import { Filter, Result } from '@/components/category';
import { categoryApi } from '@/apis';
import { ICategory } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';

interface CategoryProps {
  category: ICategory.NestedCategory;
}

const Category = (props: CategoryProps) => {
  const { category } = props;
  const { name, banners, parents, children } = category;
  return (
    <Page title="Buy online at good price | Tipe Shop">
      <Teleport />
      <Fragment>
        <Breadcrumbs
          current={name}
          links={parents.map((category) => {
            const { _id, name, slug } = category;
            return { title: name, path: PATH_MAIN.category(slug, _id) };
          })}
        />
        <Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
          <Filter _children={children} />
          <Result name={name} banners={banners} />
        </Stack>
      </Fragment>
    </Page>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  if (!params?.params?.[1]) {
    console.log('Category generated with error: params not found');
    return {
      notFound: true,
    };
  }

  const _id = params.params[1];
  const { data: category } = await categoryApi.staticFindById(parseInt(_id));
  if (_.isNil(category) || _.isEmpty(category)) {
    console.log('Category generated with error: resources not found');
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
    },
  };
};

export default Category;

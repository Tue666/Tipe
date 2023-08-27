import { Fragment } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Stack } from '@mui/material';
import { Breadcrumbs, Page, Teleport } from '@/components';
import { Filter, Result } from '@/components/category';
import { categoryApi } from '@/apis';
import { ICategory } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<CategoryProps, CategoryParams> = async (context) => {
  const { params } = context.params!; // params is the value of dynamic route
  const [slug, _id] = params;
  const category = await categoryApi.staticFindById(_id);
  return {
    props: {
      category: category.data,
    },
  };
};

type CategoryParams = {
  params: string[];
};

interface CategoryProps {
  category: ICategory.Category;
}

const Category = ({ category }: CategoryProps) => {
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
          <Filter children={children} />
          <Result name={name} banners={banners} />
        </Stack>
      </Fragment>
    </Page>
  );
};

export default Category;

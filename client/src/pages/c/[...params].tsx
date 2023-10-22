import _ from 'lodash';
import { Fragment } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { Breadcrumbs, Page, Teleport } from '@/components';
import { Filter, Result } from '@/components/category';
import { categoryApi, productApi } from '@/apis';
import { ICategory, IProduct } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';
import { LIMIT_RECOMMEND_NUMBER } from '@/configs/constants';

interface CategoryProps {
  category: ICategory.NestedCategory;
  recommend: IProduct.FindForRecommendResponse;
}

const Category = (props: CategoryProps) => {
  const { category, recommend } = props;
  const { name, banners, parents, children } = category;
  const { products, attributes, totalProduct, pagination } = recommend;
  console.log('Category render');
  const { asPath, query, push } = useRouter();
  const { params, ...queries } = query;
  console.log(queries);

  const handleNavigate = () => {
    push(`${asPath}?color=Black`);
  };
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
          <Filter _children={children} attributes={attributes} handleNavigate={handleNavigate} />
          <Result
            name={name}
            banners={banners}
            products={products}
            totalProduct={totalProduct}
            pagination={pagination}
          />
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
  try {
    const { params } = context;
    if (!params?.params?.[1]) {
      console.log('Category generated with error: params not found');
      return {
        notFound: true,
      };
    }

    const _id = params.params[1];
    const category = await categoryApi.findById(parseInt(_id));
    if (_.isNil(category) || _.isEmpty(category)) {
      console.log('Category generated with error: resources not found');
      return {
        notFound: true,
      };
    }

    const { _id: categoryId, children } = category;
    const categories = `${categoryId},${children.map((category) => category._id).join(',')}`;
    const recommend = await productApi.findForRecommend({
      categories,
      limit: LIMIT_RECOMMEND_NUMBER,
    });
    if (_.isNil(recommend) || _.isEmpty(recommend)) {
      console.log('Recommend generated with error: resources not found');
      return {
        notFound: true,
      };
    }

    return {
      props: {
        category,
        recommend,
      },
    };
  } catch (error) {
    console.log('Category generated with error:', error);
    return {
      notFound: true,
    };
  }
};

export default Category;

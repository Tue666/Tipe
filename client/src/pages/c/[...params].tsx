import _ from 'lodash';
import qs from 'query-string';
import { Fragment, useEffect, useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { styled, Skeleton, Stack } from '@mui/material';
import { Breadcrumbs, Page, Teleport } from '@/components';
import { Filter, Result } from '@/components/category';
import { categoryApi, productApi } from '@/apis';
import { ICategory, IProduct, ISchema } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';
import { LIMIT_RECOMMEND_NUMBER } from '@/configs/constants';
import { RouterUtil } from '@/utils';

interface CategoryProps {
  category: ICategory.NestedCategory;
  recommend: IProduct.FindForRecommendResponse;
}

const Category = (props: CategoryProps) => {
  console.log('Category render');
  const { category, recommend } = props;
  const { _id, name, banners, parents, children } = category;
  const [recommendCS, setRecommendCS] = useState(recommend);
  const { products, attributes, totalProduct, pagination } = recommendCS;
  const { asPath, query, replace } = useRouter();
  const shouldRenderRef = useRef(false); // Fix useRouter dependencies cause infinite loop
  const queryParamsRef = useRef({});
  useEffect(() => {
    console.log('Effect called');
    const findForRecommendCS = async () => {
      console.log('Fetch recommend');
      const categories = `${_id},${children.map((category) => category._id).join(',')}`;
      const recommendCS = await productApi.findForRecommend({
        categories,
        ...queryParamsRef.current,
        limit: LIMIT_RECOMMEND_NUMBER,
      });
      setRecommendCS(recommendCS);
    };
    if (shouldRenderRef.current) {
      shouldRenderRef.current = false;
      findForRecommendCS();
    }

    return () => setRecommendCS({} as IProduct.FindForRecommendResponse);
  }, [query]);

  const handleSelectFilter = (
    key: ISchema.Attribute['k'],
    value: ISchema.Attribute['v'],
    multiple: boolean = false,
    resetPage: boolean = true
  ) => {
    shouldRenderRef.current = true;
    const queryParams = RouterUtil.buildUrlQueryObject(
      key,
      value,
      multiple,
      queryParamsRef.current
    );
    replace(`${asPath.split('?')[0]}?${qs.stringify(queryParams)}`);
  };
  return (
    <Page title="Buy online at good price | Tipe Shop">
      <Teleport />
      {!_.isNil(recommendCS) && !_.isEmpty(recommendCS) && (
        <Fragment>
          <Breadcrumbs
            current={name}
            links={parents.map((category) => {
              const { _id, name, slug } = category;
              return { title: name, path: PATH_MAIN.category(slug, _id) };
            })}
          />
          <Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
            <Filter
              _children={children}
              queryParams={queryParamsRef.current}
              handleSelectFilter={handleSelectFilter}
              attributes={attributes}
            />
            <Result
              name={name}
              banners={banners}
              queryParams={queryParamsRef.current}
              handleSelectFilter={handleSelectFilter}
              products={products}
              totalProduct={totalProduct}
              pagination={pagination}
            />
          </Stack>
        </Fragment>
      )}
      {(_.isNil(recommendCS) || _.isEmpty(recommendCS)) && (
        <Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
          <FilterSkeleton>
            {[...Array(3)].map((_, index) => (
              <Stack key={index} sx={{ mb: 3 }}>
                <Skeleton variant="text" height={50} />
                {[...Array(4)].map((_, index) => (
                  <Fragment key={index}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={200} />
                  </Fragment>
                ))}
              </Stack>
            ))}
          </FilterSkeleton>
          <ResultSkeleton>
            <Skeleton variant="text" width={300} height={50} />
            <Skeleton variant="text" height={50} />
            <Wrapper>
              {[...Array(12)].map((_, index) => (
                <Stack key={index} sx={{ p: 2 }}>
                  <Skeleton variant="rectangular" width={180} height={180} />
                  <Skeleton variant="text" height={45} />
                  <Skeleton variant="text" width={150} />
                  <Skeleton variant="text" width={130} />
                </Stack>
              ))}
            </Wrapper>
          </ResultSkeleton>
        </Stack>
      )}
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

const FilterSkeleton = styled(Stack)(({ theme }) => ({
  width: '250px',
  borderRight: `2px solid ${theme.palette.background.default}`,
  backgroundColor: theme.palette.background.paper,
  padding: '10px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: '10px',
  },
}));

const ResultSkeleton = styled(Stack)(({ theme }) => ({
  padding: '15px',
  width: 'calc(100% - 250px)',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Wrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export default Category;

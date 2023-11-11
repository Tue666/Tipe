import _ from 'lodash';
import qs from 'query-string';
import { Fragment, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { styled, Skeleton, Stack } from '@mui/material';
import { Breadcrumbs, Hidden, Page, Teleport } from '@/components';
import { Filter, FilterMobile, Result } from '@/components/category';
import { categoryApi, productApi } from '@/apis';
import { ICategory, IProduct, ISchema } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';
import { LIMIT_RECOMMEND_NUMBER, STYLE } from '@/configs/constants';
import { RouterUtil } from '@/utils';

interface CategoryProps {
  category: ICategory.NestedCategory;
  recommend: IProduct.FindForRecommendResponse;
}

const Category = (props: CategoryProps) => {
  const { category, recommend } = props;
  const { _id, name, banners, parents, children } = category;
  const [recommendCS, setRecommendCS] = useState(recommend);
  const { products, attributes, totalProduct, pagination } = recommendCS;
  const { asPath, query, replace } = useRouter();
  const { params, ...queriesParams } = query;
  const shouldRenderRef = useRef(false); // Fix useRouter dependencies cause infinite loop
  useEffect(() => {
    const findForRecommendCS = async () => {
      const categories = `${_id},${children.map((category) => category._id).join(',')}`;
      const recommendCS = await productApi.findForRecommend({
        categories,
        ...queriesParams,
        limit: LIMIT_RECOMMEND_NUMBER,
      });
      setRecommendCS(recommendCS);
    };

    if (shouldRenderRef.current) {
      shouldRenderRef.current = false;
      findForRecommendCS();
    }

    return () => {
      if (shouldRenderRef.current) {
        setRecommendCS({} as IProduct.FindForRecommendResponse);
      }
    };
  }, [_id, children, queriesParams]);

  const handleChangeQueryParam = (
    key: ISchema.Attribute['k'],
    value: ISchema.Attribute['v'],
    isMultiple: boolean = false,
    resetPage: boolean = false
  ) => {
    shouldRenderRef.current = true;
    const queryParams = RouterUtil.buildUrlQueryObject(
      key,
      value,
      isMultiple,
      resetPage,
      queriesParams
    );
    replace(`${asPath.split('?')[0]}?${qs.stringify(queryParams)}`);
  };
  const handleRemoveQueryParams = (keys: ISchema.Attribute['k'][]) => {
    shouldRenderRef.current = true;
    for (const key in queriesParams) {
      if (keys.indexOf(key) !== -1) {
        delete queriesParams[key];
      }
    }
    replace(`${asPath.split('?')[0]}?${qs.stringify(queriesParams)}`);
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
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
            <Hidden breakpoint="md" type="Down">
              <Filter
                _children={children}
                queryParams={queriesParams}
                handleChangeQueryParam={handleChangeQueryParam}
                attributes={attributes}
              />
            </Hidden>
            <Hidden breakpoint="md" type="Up">
              <FilterMobile />
            </Hidden>
            <Result
              name={name}
              banners={banners}
              queryParams={queriesParams}
              handleChangeQueryParam={handleChangeQueryParam}
              handleRemoveQueryParams={handleRemoveQueryParams}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
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
  width: STYLE.DESKTOP.CATEGORY.FILTER_WIDTH,
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
  width: `calc(100% - ${STYLE.DESKTOP.CATEGORY.FILTER_WIDTH})`,
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

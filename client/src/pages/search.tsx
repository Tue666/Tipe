import _ from 'lodash';
import qs from 'query-string';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { styled, Skeleton, Stack } from '@mui/material';
import { Hidden, Page, Teleport } from '@/components';
import { Filter, FilterMobile, Result } from '@/components/search';
import { productApi } from '@/apis';
import { IProduct, ISchema } from '@/models/interfaces';
import { LIMIT_RECOMMEND_NUMBER, STYLE } from '@/configs/constants';
import { RouterUtil } from '@/utils';

const Search = () => {
  const [searchKeywordCS, setSearchKeywordCS] =
    useState<IProduct.FindForSearchKeywordResponse | null>(null);
  const { asPath, query, isReady, replace } = useRouter();
  const { params, keyword, ...queriesParams } = query;
  const shouldRenderRef = useRef(true); // Fix useRouter dependencies cause infinite loop

  useEffect(() => {
    const findForSearchKeywordCS = async () => {
      const searchKeywordCS = await productApi.findForSearchKeyword({
        keyword: keyword as string,
        ...queriesParams,
        limit: LIMIT_RECOMMEND_NUMBER,
      });
      setSearchKeywordCS(searchKeywordCS);
    };

    if (isReady && shouldRenderRef.current) {
      shouldRenderRef.current = false;
      findForSearchKeywordCS();
    }

    return () => {
      if (shouldRenderRef.current) {
        setSearchKeywordCS({} as IProduct.FindForRecommendResponse);
      }
    };
  }, [keyword, queriesParams, isReady]);

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
    replace(`${asPath.split('?')[0]}?keyword=${keyword}&${qs.stringify(queryParams)}`);
  };
  const handleRemoveQueryParams = (keys: ISchema.Attribute['k'][]) => {
    shouldRenderRef.current = true;
    for (const key in queriesParams) {
      if (keys.indexOf(key) !== -1) {
        delete queriesParams[key];
      }
    }
    replace(`${asPath.split('?')[0]}?keyword=${keyword}&${qs.stringify(queriesParams)}`);
  };
  return (
    <Page title={`Buy ${keyword} online at good price | Tipe Shop`}>
      <Teleport />
      {!_.isNil(searchKeywordCS) &&
        !_.isEmpty(searchKeywordCS) &&
        (() => {
          const { products, attributes, totalProduct, pagination } = searchKeywordCS;
          return (
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
              <Hidden breakpoint="md" type="Down">
                <Filter
                  queryParams={queriesParams}
                  handleChangeQueryParam={handleChangeQueryParam}
                  attributes={attributes}
                />
              </Hidden>
              <Hidden breakpoint="md" type="Up">
                <FilterMobile />
              </Hidden>
              <Result
                keyword={keyword as string}
                queryParams={queriesParams}
                handleChangeQueryParam={handleChangeQueryParam}
                handleRemoveQueryParams={handleRemoveQueryParams}
                products={products}
                totalProduct={totalProduct}
                pagination={pagination}
              />
            </Stack>
          );
        })()}
      {(_.isNil(searchKeywordCS) || _.isEmpty(searchKeywordCS)) && (
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

export default Search;

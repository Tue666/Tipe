import _ from 'lodash';
import { ChangeEvent } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { Alert, Chip, Pagination, Stack, Typography, styled } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { ProductCard } from '@/components';
import { Carousel } from '../_external_/react-slick';
import { Image } from '../overrides';
import { buildImageLink } from '@/utils';
import { IProduct, ISchema } from '@/models/interfaces';
import { LIMIT_RECOMMEND_NUMBER, STYLE } from '@/configs/constants';

interface Filter {
  title: string;
  value: IProduct.RecommendSort;
}

const SORT: Filter[] = [
  {
    title: 'Popular',
    value: 'popular',
  },
  {
    title: 'Selling',
    value: 'top_selling',
  },
  {
    title: 'Newest',
    value: 'newest',
  },
  {
    title: 'Low To High Price',
    value: 'price-asc',
  },
  {
    title: 'High To Low Price',
    value: 'price-desc',
  },
];

interface ResultProps
  extends Pick<IProduct.FindForRecommendResponse, 'products' | 'totalProduct' | 'pagination'> {
  name: string;
  banners?: string[];
  queryParams: ParsedUrlQuery;
  handleChangeQueryParam: (
    key: ISchema.Attribute['k'],
    value: ISchema.Attribute['v'],
    isMultiple?: boolean,
    resetPage?: boolean
  ) => void;
  handleRemoveQueryParams: (keys: ISchema.Attribute['k'][]) => void;
}

const Result = (props: ResultProps) => {
  const {
    name,
    banners,
    queryParams,
    handleChangeQueryParam,
    handleRemoveQueryParams,
    products,
    totalProduct,
    pagination,
  } = props;
  const { sort, newest, ...restQueryParams } = queryParams;
  const { currentPage, totalPage } = pagination;

  const handleChangeSort = (sortBy: IProduct.RecommendSort) => {
    handleChangeQueryParam('sort', sortBy, false, true);
  };
  const handleChangePage = (e: ChangeEvent<unknown>, newPage: number) => {
    handleChangeQueryParam('newest', ((newPage - 1) * LIMIT_RECOMMEND_NUMBER).toString());
  };
  return (
    <Root>
      <Wrapper direction="row" alignItems="center" spacing={1} p={2}>
        <Typography variant="h6">{name}: </Typography>
        <Typography variant="subtitle1" fontSize="17px">
          {totalProduct}
        </Typography>
      </Wrapper>
      {banners && banners.length > 0 && (
        <Wrapper pb={1}>
          <Carousel>
            {banners.map((banner, index) => {
              return (
                <Image
                  key={index}
                  src={buildImageLink(banner)}
                  alt="banner"
                  sx={{
                    height: '250px',
                  }}
                />
              );
            })}
          </Carousel>
        </Wrapper>
      )}
      <Wrapper sx={{ position: 'relative' }}>
        <SortWrapper direction="row" alignItems="center">
          {SORT.map((by) => {
            const { title, value } = by;
            return (
              <SortText
                key={value}
                className={value === (sort || SORT[0].value) ? 'active' : ''}
                onClick={() => handleChangeSort(value)}
              >
                {title}
              </SortText>
            );
          })}
        </SortWrapper>
        {!_.isEmpty(restQueryParams) && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ m: 2 }}>
            {Object.keys(restQueryParams).map((queryKey) => {
              const queryValues = restQueryParams[queryKey]!;
              if (queryValues instanceof Array) {
                return queryValues.map((value, index) => (
                  <Chip
                    key={index}
                    label={value}
                    color="error"
                    size="small"
                    onDelete={() => handleChangeQueryParam(queryKey, value, true, true)}
                  />
                ));
              }
              return (
                <Chip
                  key={queryKey}
                  label={queryValues}
                  color="error"
                  size="small"
                  onDelete={() => handleChangeQueryParam(queryKey, queryValues, false, true)}
                />
              );
            })}
            <Typography
              variant="subtitle2"
              color="error"
              sx={{ cursor: 'pointer' }}
              onClick={() => handleRemoveQueryParams(Object.keys(restQueryParams))}
            >
              Remove all
            </Typography>
          </Stack>
        )}
        {products?.length > 0 && (
          <ResultWrapper>
            {products.map((product, index) => {
              return <ProductCard key={index} product={product} />;
            })}
          </ResultWrapper>
        )}
        {products?.length <= 0 && (
          <Stack alignItems="center" py={5}>
            <Alert icon={<HelpOutline />} severity="warning">
              Sorry, no products were found to match your selection
            </Alert>
          </Stack>
        )}
      </Wrapper>
      {products?.length > 0 && (
        <PaginationWrapper>
          <Pagination
            color="primary"
            page={currentPage}
            count={totalPage}
            hidePrevButton={currentPage <= 1}
            hideNextButton={currentPage >= totalPage}
            onChange={handleChangePage}
          />
        </PaginationWrapper>
      )}
    </Root>
  );
};

const Root = styled(Stack)(({ theme }) => ({
  width: `calc(100% - ${STYLE.DESKTOP.CATEGORY.FILTER_WIDTH})`,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Wrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ResultWrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  paddingBlock: '10px',
});

const SortWrapper = styled(Stack)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.background.default} `,
  position: 'sticky',
  top: STYLE.DESKTOP.HEADER.HEIGHT,
  zIndex: '99',
  backgroundColor: theme.palette.background.paper,
}));

const SortText = styled('span')(({ theme }) => ({
  textTransform: 'capitalize',
  cursor: 'pointer',
  fontSize: '14px',
  margin: '0 16px',
  padding: '8px',
  '&:hover, &.active': {
    color: theme.palette.primary.main,
    borderBottom: `4px solid ${theme.palette.primary.main}`,
  },
}));

const PaginationWrapper = styled('div')({
  marginTop: '20px',
  alignSelf: 'end',
});

export default Result;

import _ from 'lodash';
import { ParsedUrlQuery } from 'querystring';
import { Alert, Chip, Pagination, Stack, Typography, styled } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { ProductCard } from '@/components';
import { Carousel } from '../_external_/react-slick';
import { Image } from '../overrides';
import { buildImageLink } from '@/utils';
import { IProduct, ISchema } from '@/models/interfaces';
import { RecommendSort } from '@/models/interfaces/product';

interface Filter {
  title: string;
  value: RecommendSort;
  key: string;
  direction?: number;
}

const FILTERS: Filter[] = [
  {
    title: 'Popular',
    value: 'popular',
    key: 'popular',
  },
  {
    title: 'Selling',
    value: 'top_selling',
    key: 'top_selling',
  },
  {
    title: 'Newest',
    value: 'newest',
    key: 'newest',
  },
  {
    title: 'Low To High Price',
    value: 'price',
    key: 'price-asc',
    direction: 1,
  },
  {
    title: 'High To Low Price',
    value: 'price',
    key: 'price-desc',
    direction: -1,
  },
];

interface ResultProps
  extends Pick<IProduct.FindForRecommendResponse, 'products' | 'totalProduct' | 'pagination'> {
  name: string;
  banners?: string[];
  queryParams: ParsedUrlQuery;
  handleSelectFilter: (
    key: ISchema.Attribute['k'],
    value: ISchema.Attribute['v'],
    isMultiple?: boolean
  ) => void;
}

const Result = (props: ResultProps) => {
  const { name, banners, queryParams, handleSelectFilter, products, totalProduct, pagination } =
    props;
  const { ...restQueryParams } = queryParams;
  console.log(restQueryParams);
  const { currentPage, totalPage } = pagination;
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
        <FilterWrapper direction="row" alignItems="center">
          {FILTERS.map((filter) => {
            const { title, key } = filter;
            return (
              <FilterText key={key} className={key === FILTERS[0].key ? 'active' : ''}>
                {title}
              </FilterText>
            );
          })}
        </FilterWrapper>
        {!_.isEmpty(restQueryParams) && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ m: 2 }}>
            {Object.keys(restQueryParams).map((queryKey, index) => {
              const queryValues = restQueryParams[queryKey]!;
              if (queryValues instanceof Array) {
                return queryValues.map((value) => (
                  <Chip
                    key={index}
                    label={value}
                    color="error"
                    size="small"
                    onDelete={() => handleSelectFilter(queryKey, value, true)}
                  />
                ));
              }
              return (
                <Chip
                  key={index}
                  label={queryValues}
                  color="error"
                  size="small"
                  onDelete={() => handleSelectFilter(queryKey, queryValues)}
                />
              );
            })}
            <Typography
              variant="subtitle2"
              color="error"
              sx={{ cursor: 'pointer' }}
              onClick={() => {}}
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
          />
        </PaginationWrapper>
      )}
    </Root>
  );
};

const Root = styled(Stack)(({ theme }) => ({
  width: `calc(100% - 250px)`,
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

const FilterWrapper = styled(Stack)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.background.default} `,
  position: 'sticky',
  top: '140px',
  zIndex: '99',
  backgroundColor: theme.palette.background.paper,
}));

const FilterText = styled('span')(({ theme }) => ({
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

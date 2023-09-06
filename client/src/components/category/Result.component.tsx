import { Alert, Chip, Pagination, Stack, Typography, styled } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { ProductCard } from '@/components';
import { Carousel } from '../_external_/react-slick';
import { Image } from '../overrides';
import { appConfig } from '@/configs/apis';

interface ResultProps {
  name: string;
  banners?: string[];
}

const Result = (props: ResultProps) => {
  const { name, banners } = props;
  return (
    <Root>
      <Wrapper direction="row" alignItems="center" spacing={1} p={2}>
        <Typography variant="h6">{name}: </Typography>
        <Typography variant="subtitle1" fontSize="17px">
          99
        </Typography>
      </Wrapper>
      {banners && banners.length > 0 && (
        <Wrapper pb={1}>
          <Carousel>
            {banners.map((banner, index) => {
              return (
                <Image
                  key={index}
                  src={`${appConfig.image_storage_url}/${banner}`}
                  alt=""
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
          <FilterText className="active">Popular</FilterText>
          {[...Array(5)].map((_, index) => (
            <FilterText key={index}>Newest</FilterText>
          ))}
        </FilterWrapper>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ m: 2 }}>
          {[...Array(2)].map((_, index) => {
            return (
              <Chip key={index} label="From 400.000 to 13.500.000" color="error" size="small" />
            );
          })}
          <Typography variant="subtitle2" color="error" sx={{ cursor: 'pointer' }}>
            Remove all
          </Typography>
        </Stack>
        {99 > 0 && (
          <ResultWrapper>
            {/* {[...Array(20)].map((_, index) => {
              return <ProductCard key={index} />;
            })} */}
          </ResultWrapper>
        )}
        {99 <= 0 && (
          <Stack alignItems="center" py={5}>
            <Alert icon={<HelpOutline />} severity="warning">
              Sorry, no products were found to match your selection
            </Alert>
          </Stack>
        )}
      </Wrapper>
      {99 > 0 && (
        <PaginationWrapper>
          <Pagination />
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

const FilterText = styled('span')({
  textTransform: 'capitalize',
  cursor: 'pointer',
  fontSize: '14px',
  margin: '0 16px',
  padding: '8px',
  '&:hover, &.active': {
    color: '#f53d2d',
    borderBottom: '4px solid #f53d2d',
  },
});

const PaginationWrapper = styled('div')({
  marginTop: '20px',
  alignSelf: 'end',
});

export default Result;

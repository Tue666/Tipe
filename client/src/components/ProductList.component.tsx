import { Stack, styled, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ProductCard } from '@/components';
import useInfiniteProduct from '@/hooks/useInfiniteProduct.hook';

interface ProductListProps {
  id: string;
  title?: string;
}

const ProductList = (props: ProductListProps) => {
  const { id, title } = props;
  const { handleNextPage, isLoading, hasMore, infiniteProducts } = useInfiniteProduct();

  return (
    <Stack id={id} spacing={1}>
      {title && <Typography variant="subtitle2">{title}</Typography>}
      {!title && <div></div>}
      <Wrapper>
        {infiniteProducts.map((product, index) => {
          return <ProductCard key={index} product={product} />;
        })}
      </Wrapper>
      {hasMore && (
        <LoadingButton
          loading={isLoading}
          variant="outlined"
          sx={{ width: '40%', alignSelf: 'center' }}
          onClick={handleNextPage}
        >
          Load More
        </LoadingButton>
      )}
    </Stack>
  );
};

const Wrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: '50px',
});

export default ProductList;

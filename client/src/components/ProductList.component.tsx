import { Stack, styled, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ProductCard } from '@/components';
import { IProduct } from '@/models/interfaces';
import useInfiniteProduct from '@/hooks/useInfiniteProduct.hook';

interface ProductListProps {
  id: string;
  title?: string;
  suggestion: IProduct.FindForSuggestionResponse;
}

const ProductList = ({ id, title, suggestion }: ProductListProps) => {
  const { products } = suggestion;
  const { handleNextPage, isLoading, hasMore, infiniteProducts } = useInfiniteProduct({
    initFromScratch: false,
  });

  return (
    <Stack id={id} spacing={1}>
      {title && <Typography variant="subtitle2">{title}</Typography>}
      {!title && <div></div>}
      <Wrapper>
        {[...products, ...infiniteProducts].map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
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

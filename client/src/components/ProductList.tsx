import { Button, Stack, styled, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

//
import ProductCard from "./ProductCard";

interface ProductListProps {
  id: string;
  title: string;
}

const ProductList = ({ id, title }: ProductListProps) => {
  return (
    <Stack id={id} spacing={1}>
      <Typography variant="subtitle2">{title}</Typography>
      <Wrapper>
        {[...Array(10)].map((_, index) => (
          <ProductCard key={index} />
        ))}
      </Wrapper>
      <LoadingButton
        variant="outlined"
        sx={{ width: "40%", alignSelf: "center" }}
      >
        Load More
      </LoadingButton>
    </Stack>
  );
};

const Wrapper = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "50px",
});

export default ProductList;

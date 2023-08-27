import { Fragment } from 'react';
import { Stack, styled } from '@mui/material';
import { Breadcrumbs, Page, ProductList, ProductSection, Teleport } from '@/components';
import { Images, Information, Specification, Description, Review } from '@/components/product';
import { PRODUCT_TELEPORTS } from '@/configs/teleport/product.teleport';
import { STYLE } from '@/configs/constants';

const Product = () => {
  const { ids, titles, actions } = PRODUCT_TELEPORTS;
  return (
    <Page title={`Thú nhồi bông | Tipe Shop`}>
      <Teleport actions={actions} />
      <Fragment>
        <Breadcrumbs current="Thú nhồi bông" />
        <Wrapper id={ids['information']}>
          <Stack
            direction={{ xs: 'column', sm: 'row', lg: 'row' }}
            spacing={2}
            justifyContent="space-between"
          >
            <Images />
            <Information />
          </Stack>
        </Wrapper>
        <Wrapper>
          <Title>Similar Products</Title>
          <ProductSection id={ids['similar-section']} title={titles['similar-section']} />
        </Wrapper>
        <Wrapper id={ids['specifications']}>
          <Title>Specifications</Title>
          <Specification />
        </Wrapper>
        <Wrapper id={ids['description']}>
          <Title>Product Description</Title>
          <Description />
        </Wrapper>
        <Wrapper id={ids['review']}>
          <Title>Ratings - Reviews from customers</Title>
          <Review />
        </Wrapper>
      </Fragment>
      <Stack>
        <DiscoverMore>Discover more for you</DiscoverMore>
        <ProductList id={ids['product-list']} />
      </Stack>
    </Page>
  );
};

const Wrapper = styled('div')(({ theme }) => ({
  margin: '20px 0',
  padding: '15px',
  backgroundColor: theme.palette.background.paper,
}));

const Title = styled('span')({
  fontWeight: 'bold',
  fontSize: '15px',
  display: 'block',
  paddingBottom: '10px',
  textTransform: 'capitalize',
});

const DiscoverMore = styled('div')(({ theme }) => ({
  padding: '15px',
  fontWeight: 'bold',
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  top: `calc(${STYLE.DESKTOP.HEADER.HEIGHT} + 9px)`,
  zIndex: 99,
  marginBottom: '10px',
  '&:before, &:after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '10px',
    backgroundColor: theme.palette.background.default,
    left: 0,
  },
  '&:before': {
    top: '-10px',
  },
  '&:after': {
    bottom: '-10px',
  },
}));

export default Product;

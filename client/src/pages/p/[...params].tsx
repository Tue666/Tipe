import _ from 'lodash';
import { Fragment } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Stack, styled } from '@mui/material';
import { Breadcrumbs, Page, ProductList, ProductSection, Teleport } from '@/components';
import { Images, Information, Specification, Description, Review } from '@/components/product';
import { PRODUCT_TELEPORTS } from '@/configs/teleport/product.teleport';
import { LIMIT_SUGGESTION_NUMBER, LIMIT_WIDGET_NUMBER, STYLE } from '@/configs/constants';
import { IProduct } from '@/models/interfaces';
import { productApi } from '@/apis';
import { PATH_MAIN } from '@/configs/routers';

interface ProductProps {
  product: IProduct.NestedProduct;
  similarWidget: IProduct.FindForWidgetResponse;
  suggestion: IProduct.FindForSuggestionResponse;
}

const Product = (props: ProductProps) => {
  const { ids, titles, actions } = PRODUCT_TELEPORTS;
  const { product, similarWidget, suggestion } = props;
  const {
    _id,
    name,
    images,
    quantity,
    limit,
    discount_rate,
    original_price,
    price,
    description,
    quantity_sold,
    rating_average,
    review_count,
    inventory_status,
    breadcrumbs,
  } = product;
  const informationProps = {
    _id,
    name,
    quantity,
    limit,
    discount_rate,
    original_price,
    price,
    quantity_sold,
    rating_average,
    review_count,
    inventory_status,
  };
  return (
    <Page title={`${name} | Tipe Shop`}>
      <Teleport actions={actions} />
      <Fragment>
        <Breadcrumbs
          links={breadcrumbs.map((breadcrumb) => {
            const { _id, name, slug } = breadcrumb;
            return {
              title: name,
              path: PATH_MAIN.category(slug, _id),
            };
          })}
          current={name}
        />
        <Wrapper id={ids['information']}>
          <Stack
            direction={{ xs: 'column', sm: 'row', lg: 'row' }}
            spacing={2}
            justifyContent="space-between"
          >
            <Images images={images} />
            <Information {...informationProps} />
          </Stack>
        </Wrapper>
        {similarWidget.products.length && (
          <Wrapper>
            <Title>Similar Products</Title>
            <ProductSection
              id={ids['similar-section']}
              title={titles['similar-section']}
              products={similarWidget.products}
            />
          </Wrapper>
        )}
        <Wrapper id={ids['specifications']}>
          <Title>Specifications</Title>
          <Specification />
        </Wrapper>
        {description && (
          <Wrapper id={ids['description']}>
            <Title>Product Description</Title>
            <Description description={description} />
          </Wrapper>
        )}
        <Wrapper id={ids['review']}>
          <Title>Ratings - Reviews from customers</Title>
          <Review />
        </Wrapper>
      </Fragment>
      <Stack>
        <DiscoverMore>Discover more for you</DiscoverMore>
        <ProductList id={ids['product-list']} suggestion={suggestion} />
      </Stack>
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
      console.log('Product generated with error: params not found');
      return {
        notFound: true,
      };
    }

    const _id = params.params[1];
    const product = await productApi.findById(_id);
    const similarWidget = await productApi.findForWidget('similar', {
      _id,
      limit: LIMIT_WIDGET_NUMBER,
    });
    const suggestion = await productApi.findForSuggestion({
      limit: LIMIT_SUGGESTION_NUMBER,
    });
    if (_.isNil(product) || _.isEmpty(product)) {
      console.log('Product generated with error: resources not found');
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product,
        similarWidget,
        suggestion,
      },
    };
  } catch (error) {
    console.log('Product generated with error:', error);
    return {
      notFound: true,
    };
  }
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

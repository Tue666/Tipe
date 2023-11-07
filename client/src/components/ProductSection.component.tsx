import _ from 'lodash';
import { Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Carousel } from './_external_/react-slick';
import { Link } from './overrides';
import { STYLE } from '@/configs/constants';
import { ProductCard } from '@/components';
import { IProduct } from '@/models/interfaces';

interface ProductSectionProps {
  id: string;
  title?: string;
  products?: IProduct.FindForWidgetResponse['products'];
}

const ProductSection = (props: ProductSectionProps) => {
  const { id, title, products } = props;
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Stack id={id} spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {title && <Typography variant="subtitle2">{title}</Typography>}
        {!title && <div></div>}
        <Link href="/auth">
          <Typography variant="subtitle2" color="primary">
            View more <i className="bi bi-chevron-right"></i>
          </Typography>
        </Link>
      </Stack>
      <Carousel
        settings={{
          className: 'slider variable-width',
          variableWidth: true,
          slidesToShow: isMdDown
            ? STYLE.MOBILE.PRODUCT_SECTION.SLIDE_TO_SHOW
            : STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_TO_SHOW,
          dots: false,
          infinite: products?.length ?? 0 > 5 ? true : false,
        }}
      >
        {!_.isNil(products) &&
          products.map((product, index) => {
            return <ProductCard key={index} product={product} />;
          })}
        {_.isNil(products) &&
          [...Array(isMdDown ? 1 : 5)].map((_, index) => (
            <Stack key={index} sx={{ p: 2 }}>
              <Skeleton variant="rectangular" width={180} height={180} />
              <Skeleton variant="text" height={45} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={130} />
            </Stack>
          ))}
      </Carousel>
    </Stack>
  );
};

export default ProductSection;

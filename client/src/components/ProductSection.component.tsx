import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
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
      {products && products.length && (
        <Carousel
          settings={{
            className: 'slider variable-width',
            variableWidth: true,
            slidesToShow: isMdDown
              ? STYLE.MOBILE.PRODUCT_SECTION.SLIDE_TO_SHOW
              : STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_TO_SHOW,
            dots: false,
            infinite: products.length > 5 ? true : false,
          }}
        >
          {products.map((product, index) => {
            return <ProductCard key={index} product={product} />;
          })}
        </Carousel>
      )}
    </Stack>
  );
};

export default ProductSection;

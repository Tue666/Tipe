import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Carousel } from './_external_/react-slick';
import { Link } from './overrides';
import { STYLE } from '@/configs/constants';
import ProductCard from './ProductCard.component';

interface ProductSectionProps {
  id: string;
  title: string;
}

const ProductSection = ({ id, title }: ProductSectionProps) => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Stack id={id} spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">{title}</Typography>
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
        }}
      >
        {[...Array(10)].map((_, index) => (
          <ProductCard key={index} />
        ))}
      </Carousel>
    </Stack>
  );
};

export default ProductSection;

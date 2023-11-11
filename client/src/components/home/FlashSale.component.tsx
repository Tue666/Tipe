import _ from 'lodash';
import { Skeleton, Stack, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import { Carousel } from '../_external_/react-slick';
import { Image, Link } from '../overrides';
import { STYLE } from '@/configs/constants';
import ProductCardFlashSale from '../ProductCardFlashSale.component';
import FlipCountdownTimer from '../FlipCountdownTimer.component';
import { PATH_IMAGE, PATH_MAIN } from '@/configs/routers';
import { IProduct } from '@/models/interfaces';

interface FlashSaleProps {
  id: string;
  products?: IProduct.FindForFlashSaleResponse['products'];
}

const FlashSale = (props: FlashSaleProps) => {
  const { id, products } = props;
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  if ((products?.length ?? 0) <= 0) return null;

  return (
    <Root id={id} spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={1}>
          <Image
            src={`${PATH_IMAGE.icons}/app/flash-sale.png`}
            alt="flash-sale"
            sx={{
              width: '130px',
              height: '23px',
            }}
          />
          <FlipCountdownTimer />
        </Stack>
        <Link href={PATH_MAIN.flashSale('123')}>
          <Typography variant="subtitle2" color={theme.palette.background.paper}>
            View more <i className="bi bi-chevron-right"></i>
          </Typography>
        </Link>
      </Stack>
      <Carousel
        settings={{
          className: 'slider variable-width',
          variableWidth: true,
          infinite: STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_INFINITE,
          autoplay: STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_AUTOPLAY,
          dots: STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_DOTS,
          slidesToShow: isMdDown
            ? STYLE.MOBILE.PRODUCT_SECTION.SLIDE_TO_SHOW
            : STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_TO_SHOW,
          slidesToScroll: isMdDown
            ? STYLE.MOBILE.PRODUCT_SECTION.SLIDE_TO_SCROLL
            : STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_TO_SCROLL,
        }}
      >
        {!_.isNil(products) &&
          products.map((product, index) => {
            return <ProductCardFlashSale key={index} product={product} />;
          })}
        {_.isNil(products) &&
          [...Array(isMdDown ? 1 : 5)].map((_, index) => {
            return (
              <Stack key={index} sx={{ p: 2 }}>
                <Skeleton variant="rectangular" width={180} height={180} />
                <Skeleton variant="text" height={45} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={130} />
              </Stack>
            );
          })}
      </Carousel>
    </Root>
  );
};

const Root = styled(Stack)(({ theme }) => ({
  background: `linear-gradient(-160deg, ${theme.palette.primary.light}, transparent)`,
  borderRadius: STYLE.DESKTOP.CATEGORIES.BORDER_RADIUS,
  padding: STYLE.DESKTOP.CATEGORIES.PADDING,
}));

export default FlashSale;

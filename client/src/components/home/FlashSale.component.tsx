import _ from 'lodash';
import { Skeleton, Stack, styled, useMediaQuery, useTheme } from '@mui/material';
import { Carousel } from '../_external_/react-slick';
import { Image } from '../overrides';
import { STYLE } from '@/configs/constants';
import ProductCardFlashSale from '../ProductCardFlashSale.component';
import FlipCountdownTimer from '../FlipCountdownTimer.component';
import { PATH_IMAGE } from '@/configs/routers';
import { IProduct } from '@/models/interfaces';

interface FlashSaleProps extends Pick<IProduct.FindForFlashSaleResponse, 'products' | 'session'> {
  id: string;
  onCountdownExpired: () => Promise<void>;
}

const FlashSale = (props: FlashSaleProps) => {
  const { id, products, session, onCountdownExpired } = props;
  if ((products?.length ?? 0) <= 0) return null;

  const { end_time } = session;
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
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
          <FlipCountdownTimer targetTime={end_time} onExpired={onCountdownExpired} />
        </Stack>
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

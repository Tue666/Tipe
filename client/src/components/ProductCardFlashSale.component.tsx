import { Card, Stack, Typography, styled, useTheme } from '@mui/material';
import { Image, Link } from './overrides';
import { STYLE } from '@/configs/constants';
import { IProduct } from '@/models/interfaces';
import { buildImageLink, toVND } from '@/utils';
import { PATH_IMAGE, PATH_MAIN } from '@/configs/routers';

interface SoldRangeProps {
  total: number;
  sold: number;
}

interface ProductCardFlashSaleProps {
  product: IProduct.FindForFlashSaleResponse['products'][number];
}

const ProductCardFlashSale = (props: ProductCardFlashSaleProps) => {
  const { product } = props;
  const { _id, name, images, original_price, slug } = product;
  const theme = useTheme();

  const total = 200;
  const sold = 75;

  return (
    <Root>
      <Link href={PATH_MAIN.flashSale('123')}>
        <Image
          src={buildImageLink(images[0])}
          alt={name}
          sx={{
            height: STYLE.DESKTOP.PRODUCT.CARD_HEIGHT,
            overflow: 'hidden',
            '& > img': {
              transition: '0.5s',
            },
            '& > img:hover': {
              transform: 'scale(1.02)',
            },
            [theme.breakpoints.down('md')]: {
              height: STYLE.MOBILE.PRODUCT.CARD_HEIGHT,
            },
          }}
        />
        <Stack alignItems="center" spacing={1}>
          <Typography variant="h6" color="primary.main">
            {toVND(28700000)}
          </Typography>
          <Range total={total} sold={sold}>
            {sold / total >= 0.5 && (
              <Image
                src={`${PATH_IMAGE.icons}/app/hot-flash-sale.png`}
                alt="hot-flash-sale"
                sx={{
                  width: '21px',
                  height: '21px',
                  position: 'absolute',
                  bottom: 0,
                }}
              />
            )}
            <RangeText variant="subtitle2">{sold < total ? `${sold} Sold` : 'Sold Out'}</RangeText>
          </Range>
        </Stack>
      </Link>
    </Root>
  );
};

const Root = styled(Card)(({ theme }) => ({
  width: STYLE.DESKTOP.PRODUCT.CARD_WIDTH,
  position: 'relative',
  borderRadius: STYLE.DESKTOP.PRODUCT.CARD_BORDER_RADIUS,
  margin: STYLE.DESKTOP.PRODUCT.CARD_MARGIN,
  padding: STYLE.DESKTOP.PRODUCT.CARD_PADDING,
  backgroundImage: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 20px',
    zIndex: 1,
  },
  '& .MuiCardContent-root': {
    padding: '2px 8px',
  },
  '& .MuiCardActions-root': {
    padding: 0,
  },
  [theme.breakpoints.down('md')]: {
    width: STYLE.MOBILE.PRODUCT.CARD_WIDTH,
  },
}));

const Range = styled('div')<SoldRangeProps>(({ theme, total, sold }) => ({
  width: '155px',
  height: '18px',
  backgroundColor: theme.palette.primary.light,
  position: 'relative',
  zIndex: 1,
  margin: '0px 6px',
  borderRadius: '99em',
  '&:before': {
    content: '""',
    width: `calc(100%*${sold}/${total})`,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '99em',
  },
}));

const RangeText = styled(Typography)({
  position: 'relative',
  textAlign: 'center',
  lineHeight: '18px',
  color: '#fff',
});

export default ProductCardFlashSale;

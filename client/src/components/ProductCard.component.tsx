import { Card, CardContent, Stack, styled, Tooltip, Typography, useTheme } from '@mui/material';
import { Image, Link } from './overrides';
import { Stars, Ellipsis } from '@/components';
import { STYLE } from '@/configs/constants';
import { PATH_MAIN } from '@/configs/routers';

const ProductCard = () => {
  const theme = useTheme();
  return (
    <Root>
      <Link href={PATH_MAIN.product('slug-product-item', '1')}>
        <Image
          src="/product-card-2.jpg"
          alt=""
          sx={{
            height: STYLE.DESKTOP.PRODUCT.CARD_HEIGHT,
            overflow: 'hidden',
            '& > img:hover': {
              transition: '0.5s',
              transform: 'scale(1.02)',
            },
            [theme.breakpoints.down('md')]: {
              height: STYLE.MOBILE.PRODUCT.CARD_HEIGHT,
            },
          }}
        />
        <CardContent sx={{ height: STYLE.DESKTOP.PRODUCT.CONTENT_HEIGHT }}>
          <Tooltip placement="top" title="Product name" arrow>
            <div>
              <Ellipsis
                variant="body2"
                text="Thú Bông Chó Shiba Hóa Trang Cosplay Ngộ Nghĩnh 25cm Quà Tặng Siêu
              Dễ Thương Thú Bông Chó Shiba Thú Bông Chó Shiba"
                sx={{
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </div>
          </Tooltip>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stars total={5} rating={4} sx={{ fontSize: '15px' }} />
            <Tooltip placement="top" title="12" arrow>
              <Typography variant="body2">12</Typography>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Price>123</Price>
            <Tooltip placement="top" title="-12%" arrow>
              <SaleTag>-12%</SaleTag>
            </Tooltip>
          </Stack>
        </CardContent>
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

const SaleTag = styled('div')({
  padding: '0px 2px',
  fontSize: '12px',
  fontWeight: '400',
  border: '1px solid rgb(255, 66, 78)',
  borderRadius: '2px',
  backgroundColor: 'rgb(255, 240, 241)',
  color: 'rgb(255, 66, 78)',
});

const Price = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '16px',
  // color: tag === 'sale' ? 'red' : theme.palette.text.primary,
}));

export default ProductCard;

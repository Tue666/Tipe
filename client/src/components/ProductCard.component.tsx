import { Card, CardContent, Stack, styled, Tooltip, Typography, useTheme } from '@mui/material';
import { Image, Link } from './overrides';
import { Stars, Ellipsis } from '@/components';
import { STYLE } from '@/configs/constants';
import { PATH_MAIN } from '@/configs/routers';
import { IProduct } from '@/models/interfaces';
import { appConfig } from '@/configs/apis';
import { toVND } from '@/utils';

interface PriceProps {
  tag: 'sale' | 'normal';
}

interface ProductCardProps {
  product: IProduct.Product;
}

const ProductCard = (props: ProductCardProps) => {
  const theme = useTheme();
  const { product } = props;
  const {
    _id,
    name,
    images,
    discount,
    discount_rate,
    original_price,
    price,
    quantity_sold,
    rating_average,
    slug,
  } = product;
  return (
    <Root>
      <Link href={PATH_MAIN.product(slug, _id)}>
        <Image
          src={`${appConfig.image_storage_url}/${images[0]}`}
          alt=""
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
        <CardContent sx={{ height: STYLE.DESKTOP.PRODUCT.CONTENT_HEIGHT }}>
          <Tooltip placement="top" title={name} arrow>
            <div>
              <Ellipsis
                variant="body2"
                text={name}
                sx={{
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </div>
          </Tooltip>
          <Stack direction="row" alignItems="center" spacing={1}>
            {rating_average > 0 && (
              <Stars total={5} rating={rating_average} sx={{ fontSize: '15px' }} />
            )}
            {quantity_sold.value > 0 && (
              <Tooltip placement="top" title={quantity_sold.value} arrow>
                <Typography variant="caption">{quantity_sold.text}</Typography>
              </Tooltip>
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Price tag={discount_rate !== 0 ? 'sale' : 'normal'}>
              {discount_rate === 0 ? toVND(original_price) : toVND(price)}
            </Price>
            {discount_rate !== 0 && (
              <Tooltip placement="top" title={`-${toVND(discount)}`} arrow>
                <SaleTag>-{discount_rate}%</SaleTag>
              </Tooltip>
            )}
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

const Price = styled(Typography)<PriceProps>(({ theme, tag }) => ({
  fontWeight: 'bold',
  fontSize: '16px',
  color: tag === 'sale' ? 'red' : theme.palette.text.primary,
}));

export default ProductCard;
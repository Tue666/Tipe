import { Stack, Checkbox, IconButton, Typography, styled } from '@mui/material';
import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Image, Link } from '../overrides';
import { Hidden, QuantityInput } from '@/components';
import { STYLE } from '@/configs/constants';
import { ICart } from '@/models/interfaces';
import { appConfig } from '@/configs/apis';
import { PATH_MAIN } from '@/configs/routers';
import { toVND } from '@/utils';

interface CartItemProps {
  item: ICart.CartItem;
}

const CartItem = (props: CartItemProps) => {
  const { item } = props;
  const { _id, quantity, selected, product } = item;
  const {
    name,
    images,
    quantity: productQuantity,
    discount_rate,
    original_price,
    price,
    slug,
    inventory_status,
  } = product;
  const link = PATH_MAIN.product(slug, _id);
  return (
    <Root
      sx={
        inventory_status !== 'available' || productQuantity < 1
          ? {
              pointerEvents: 'none',
              opacity: '0.5',
            }
          : {}
      }
    >
      <ItemGroup>
        <Checkbox size="small" checked={selected} checkedIcon={<Favorite />} color="error" />
        <Link href={link}>
          <Image
            alt={name}
            src={`${appConfig.image_storage_url}/${images[0]}`}
            sx={{
              width: '80px',
              height: '80px',
            }}
          />
        </Link>
        <Stack spacing={1} sx={{ pl: 1 }}>
          <Link href={link}>
            <Name>{name}</Name>
          </Link>
          <Hidden breakpoint="md" type="Up">
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {toVND(price)}
              </Typography>
              {discount_rate > 0 && (
                <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
                  {toVND(original_price)}
                </Typography>
              )}
            </Stack>
            <QuantityInput />
          </Hidden>
        </Stack>
      </ItemGroup>
      <Hidden breakpoint="md" type="Down">
        <div>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {toVND(price)}
          </Typography>
          {discount_rate > 0 && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
              {toVND(original_price)}
            </Typography>
          )}
        </div>
        <QuantityInput />
        <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
          {toVND(quantity * price)}
        </Typography>
      </Hidden>
      <IconButton color="error">
        <DeleteForeverOutlined />
      </IconButton>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: STYLE.DESKTOP.CART.GRID_TEMPLATE_COLUMS,
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: STYLE.MOBILE.CART.GRID_TEMPLATE_COLUMS,
  },
}));

const ItemGroup = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '38px 80px 62%',
  columnGap: '5px',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '38px 80px 69%',
  },
}));

const Name = styled('span')(({ theme }) => ({
  fontSize: '13px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  '&:hover': {
    color: theme.palette.error.main,
  },
}));

export default CartItem;

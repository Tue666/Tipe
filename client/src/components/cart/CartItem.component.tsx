import { Stack, Checkbox, IconButton, Typography, styled } from '@mui/material';
import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Image, Link } from '../overrides';
import { FlashSaleIconSvg, Hidden, QuantityInput } from '@/components';
import { STYLE } from '@/configs/constants';
import { ICart, IProduct } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';
import { buildImageLink, productAvailable, toVND } from '@/utils';

interface CartItemProps {
  item: ICart.CartItem;
  handleChangeQuantity: (
    cartId: ICart.CartItem['_id'],
    productId: IProduct.Product['_id'],
    newQuantity: string
  ) => void;
  handleCheckCartItem: (params: ICart.SwitchSelectBody) => void;
  handleRemoveCartItem: (_id?: ICart.CartItem['_id']) => Promise<void>;
}

const CartItem = (props: CartItemProps) => {
  const { item, handleChangeQuantity, handleCheckCartItem, handleRemoveCartItem } = props;
  const { _id, quantity, selected, product } = item;
  let {
    _id: productId,
    name,
    images,
    quantity: productQuantity,
    flash_sale,
    limit,
    discount_rate,
    original_price,
    price,
    slug,
    inventory_status,
  } = product;
  const link = PATH_MAIN.product(slug, productId);

  limit = flash_sale ? flash_sale.limit - flash_sale.sold : limit;
  discount_rate = flash_sale?.discount_rate ?? discount_rate;
  original_price = flash_sale?.original_price ?? original_price;
  price = flash_sale?.price ?? price;

  return (
    <Root
      sx={{
        ...(!productAvailable(inventory_status, productQuantity) && {
          pointerEvents: 'none',
          opacity: '0.5',
        }),
      }}
    >
      <ItemGroup>
        <Checkbox
          size="small"
          checked={selected}
          checkedIcon={<Favorite />}
          onClick={() => handleCheckCartItem({ _id })}
        />
        <Link href={link}>
          <Image
            alt={name}
            src={buildImageLink(images[0])}
            sx={{
              width: STYLE.DESKTOP.CART.ITEM_IMAGE_SIZE,
              height: STYLE.DESKTOP.CART.ITEM_IMAGE_SIZE,
            }}
          />
        </Link>
        <Stack spacing={1} sx={{ pl: 1 }}>
          <Link href={link}>
            <Name>{name}</Name>
          </Link>
          <Hidden breakpoint="md" type="Up">
            <Stack spacing={1} direction="row" alignItems="center">
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {toVND(price)}
                </Typography>
                {flash_sale && <FlashSaleIconSvg />}
              </Stack>
              {discount_rate > 0 && (
                <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
                  {toVND(original_price)}
                </Typography>
              )}
            </Stack>
            <QuantityInput
              isInCart={true}
              input={quantity.toString()}
              quantity={productQuantity}
              limit={limit}
              setInput={(newInput) => handleChangeQuantity(_id, productId, newInput)}
              onSelfRemove={() => handleRemoveCartItem(_id)}
            />
          </Hidden>
        </Stack>
      </ItemGroup>
      <Hidden breakpoint="md" type="Down">
        <div>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {toVND(price)}
            </Typography>
            {flash_sale && <FlashSaleIconSvg />}
          </Stack>
          {discount_rate > 0 && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
              {toVND(original_price)}
            </Typography>
          )}
        </div>
        <QuantityInput
          isInCart={true}
          input={quantity.toString()}
          quantity={productQuantity}
          limit={limit}
          setInput={(newInput) => handleChangeQuantity(_id, productId, newInput)}
          onSelfRemove={() => handleRemoveCartItem(_id)}
        />
        <Typography color="primary" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {toVND(quantity * price)}
        </Typography>
      </Hidden>
      <IconButton color="primary" onClick={() => handleRemoveCartItem(_id)}>
        <DeleteForeverOutlined />
      </IconButton>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: STYLE.DESKTOP.CART.GRID_TEMPLATE_COLUMNS,
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: STYLE.MOBILE.CART.GRID_TEMPLATE_COLUMNS,
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
    color: theme.palette.primary.main,
  },
}));

export default CartItem;

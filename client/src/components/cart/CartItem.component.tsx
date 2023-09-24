import { Stack, Checkbox, IconButton, Typography, styled } from '@mui/material';
import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Image, Link } from '../overrides';
import { Hidden, QuantityInput } from '@/components';
import { STYLE } from '@/configs/constants';
import { ICart } from '@/models/interfaces';
import { appConfig } from '@/configs/apis';
import { PATH_MAIN } from '@/configs/routers';
import { productAvailable, toVND } from '@/utils';
import { useAppDispatch } from '@/redux/hooks';
import { editQuantity } from '@/redux/slices/cart.slice';

interface CartItemProps {
  item: ICart.CartItem;
  handleCheckCartItem: (params: ICart.SwitchSelectBody) => void;
  handleRemoveCartItem: (_id?: ICart.CartItem['_id']) => Promise<void>;
}

const CartItem = (props: CartItemProps) => {
  const { item, handleCheckCartItem, handleRemoveCartItem } = props;
  const { _id, quantity, selected, product } = item;
  const {
    _id: productId,
    name,
    images,
    quantity: productQuantity,
    limit,
    discount_rate,
    original_price,
    price,
    slug,
    inventory_status,
  } = product;
  const link = PATH_MAIN.product(slug, productId);
  const dispatch = useAppDispatch();

  const handleChangeQuantity = (newQuantity: string) => {
    dispatch(
      editQuantity({
        _id,
        product_id: productId,
        new_quantity: parseInt(newQuantity),
      })
    );
  };
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
          color="error"
          onClick={() => handleCheckCartItem({ _id })}
        />
        <Link href={link}>
          <Image
            alt={name}
            src={`${appConfig.image_storage_url}/${images[0]}`}
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
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {toVND(price)}
              </Typography>
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
              setInput={(newInput) => handleChangeQuantity(newInput)}
              onSelfRemove={() => handleRemoveCartItem(_id)}
            />
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
        <QuantityInput
          isInCart={true}
          input={quantity.toString()}
          quantity={productQuantity}
          limit={limit}
          setInput={(newInput) => handleChangeQuantity(newInput)}
          onSelfRemove={() => handleRemoveCartItem(_id)}
        />
        <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
          {toVND(quantity * price)}
        </Typography>
      </Hidden>
      <IconButton color="error" onClick={() => handleRemoveCartItem(_id)}>
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
    color: theme.palette.error.main,
  },
}));

export default CartItem;

import { Badge, IconButton } from '@mui/material';
import { ShoppingCartOutlined } from '@mui/icons-material';
import { Link } from '@/components/overrides';
import { PATH_MAIN } from '@/configs/routers';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/slices/cart.slice';

const CartPopover = () => {
  const { items } = useAppSelector(selectCart);
  return (
    <Badge
      color="primary"
      badgeContent={items.length}
      max={99}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Link href={PATH_MAIN.cart}>
        <IconButton color="primary">
          <ShoppingCartOutlined />
        </IconButton>
      </Link>
    </Badge>
  );
};

export default CartPopover;

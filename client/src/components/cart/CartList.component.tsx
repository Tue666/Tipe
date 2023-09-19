import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Checkbox, IconButton, Stack, Tooltip, Typography, styled } from '@mui/material';
import CartItem from './CartItem.component';
import { Hidden } from '@/components';
import { STYLE } from '@/configs/constants';
import { ICart } from '@/models/interfaces';

interface CartListProps {
  items: ICart.CartItem[];
}

const CartList = (props: CartListProps) => {
  const { items } = props;
  return (
    <Root>
      <Heading>
        <Stack spacing={1} direction="row" alignItems="center" sx={{ cursor: 'pointer' }}>
          <Checkbox size="small" checkedIcon={<Favorite />} color="error" />
          <Typography variant="subtitle2">All (10 products)</Typography>
        </Stack>
        <Hidden breakpoint="md" type="Down">
          <Typography variant="subtitle2">Single</Typography>
          <Typography variant="subtitle2">Quantity</Typography>
          <Typography variant="subtitle2">Price</Typography>
        </Hidden>
        <Tooltip placement="bottom" title="Remove selected items" arrow>
          <IconButton color="error">
            <DeleteForeverOutlined />
          </IconButton>
        </Tooltip>
      </Heading>
      <Stack spacing={2}>
        <ContentGroup>
          {/* Seller */}
          {/* Intended */}
          <Stack spacing={3}>
            {items.map((item) => {
              const { _id } = item;
              return <CartItem key={_id} item={item} />;
            })}
          </Stack>
          {/* Seller discount */}
        </ContentGroup>
      </Stack>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  width: STYLE.DESKTOP.CART.LIST_WIDTH,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const Heading = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: STYLE.DESKTOP.CART.GRID_TEMPLATE_COLUMS,
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px',
  position: 'sticky',
  top: `calc(${STYLE.DESKTOP.HEADER.HEIGHT} + 10px)`,
  padding: '5px',
  zIndex: 99,
  '&:before, &:after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '10px',
    backgroundColor: theme.palette.background.default,
  },
  '&:before': {
    top: '-10px',
  },
  '&:after': {
    bottom: '-10px',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: STYLE.MOBILE.CART.GRID_TEMPLATE_COLUMS,
  },
}));

const ContentGroup = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px',
  padding: '5px',
  marginTop: '10px',
}));

export default CartList;

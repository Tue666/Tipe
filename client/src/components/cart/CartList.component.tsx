import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Checkbox, IconButton, Stack, Tooltip, Typography, styled } from '@mui/material';
import CartItem from './CartItem.component';

const CartList = () => {
  return (
    <Root>
      <Heading>
        <Stack spacing={1} direction="row" alignItems="center" sx={{ cursor: 'pointer' }}>
          <Checkbox size="small" checkedIcon={<Favorite />} color="error" />
          <Typography variant="subtitle2">All (10 products)</Typography>
        </Stack>
        <Typography variant="subtitle2">Single</Typography>
        <Typography variant="subtitle2">Quantity</Typography>
        <Typography variant="subtitle2">Price</Typography>
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
            {[...Array(10)].map((_, index) => {
              return <CartItem key={index} />;
            })}
          </Stack>
          {/* Seller discount */}
        </ContentGroup>
      </Stack>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  width: '850px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const Heading = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '44% 20% 15.5% 15.5% 5%',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px',
  position: 'sticky',
  top: `calc(140px + 10px)`,
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
}));

const ContentGroup = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px',
  padding: '5px',
  marginTop: '10px',
}));

export default CartList;

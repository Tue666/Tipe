import { Stack, Checkbox, IconButton, Typography, styled } from '@mui/material';
import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Image, Link } from '../overrides';
import Hidden from '../Hidden.component';
import QuantityInput from '../QuantityInput.component';
import { STYLE } from '@/configs/constants';

const CartItem = () => {
  return (
    <Root>
      <ItemGroup>
        <Checkbox size="small" checkedIcon={<Favorite />} color="error" />
        <Link href="#">
          <Image
            alt=""
            src="/product-card-2.jpg"
            sx={{
              width: '80px',
              height: '80px',
            }}
          />
        </Link>
        <Stack spacing={1} sx={{ pl: 1 }}>
          <Link href="#">
            <Name>Thú nhồi bông</Name>
          </Link>
          <Hidden breakpoint="md" type="Up">
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                10.000.000
              </Typography>
              <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
                20.000.000
              </Typography>
            </Stack>
            <QuantityInput />
          </Hidden>
        </Stack>
      </ItemGroup>
      <Hidden breakpoint="md" type="Down">
        <div>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            10.000.000
          </Typography>
          <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
            20.000.000
          </Typography>
        </div>
        <QuantityInput />
        <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
          20.000.000
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

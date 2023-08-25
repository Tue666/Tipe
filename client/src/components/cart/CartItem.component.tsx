import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Checkbox, IconButton, Typography, styled } from '@mui/material';
import { Image, Link } from '../overrides';
import Hidden from '../Hidden.component';
import QuantityInput from './QuantityInput.component';

const CartItem = () => {
  return (
    <Root>
      <ItemGroup>
        <Checkbox size="small" checkedIcon={<Favorite />} color="error" />
        <Hidden breakpoint="md" type="Down">
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
        </Hidden>
        <Link href="#">
          <Name></Name>
        </Link>
      </ItemGroup>
      <div>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          10.000.000
        </Typography>
        <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
          10.000.000
        </Typography>
      </div>
      <QuantityInput />
      <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
        20.000.000
      </Typography>
      <IconButton color="error">
        <DeleteForeverOutlined />
      </IconButton>
    </Root>
  );
};

const Root = styled('div')({
  display: 'grid',
  gridTemplateColumns: '44% 20% 15.5% 15.5% 5%',
  alignItems: 'center',
});

const ItemGroup = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '38px 80px 62%',
  columnGap: '5px',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '38px 69%',
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

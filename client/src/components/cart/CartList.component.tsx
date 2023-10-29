import { Check, DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Checkbox, IconButton, Stack, Tooltip, Typography, Alert, styled } from '@mui/material';
import CartItem from './CartItem.component';
import { Hidden } from '@/components';
import { STYLE } from '@/configs/constants';
import { ICart, IProduct } from '@/models/interfaces';
import { useAppDispatch } from '@/redux/hooks';
import { CartState, editQuantity, removeCart, switchSelect } from '@/redux/slices/cart.slice';
import { useConfirm } from 'material-ui-confirm';
import { toAbbreviated, toVND } from '@/utils';
import { enqueueNotify } from '@/hooks/useSnackbar';

interface ProgressBarProps {
  achieved: number;
}

interface MarkProps {
  position: 'first' | 'end';
  achieved?: number;
}

interface TextMarkProps {
  location: 'top' | 'bottom';
}

interface CartListProps extends Pick<CartState, 'items' | 'statistics' | 'freeShippingPoints'> {}

const CartList = (props: CartListProps) => {
  const { items, statistics, freeShippingPoints } = props;
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const isSelectedAll = items.filter((item) => !item.selected).length === 0;
  const totalGuess = statistics['guess'].value;
  const renderPoints = () => {
    const finishPoint = freeShippingPoints[freeShippingPoints.length - 1];
    const totalAchieved = (totalGuess / finishPoint.value) * 100;
    const startPointDOM = (
      <Mark key={0} position="first">
        <TextMark location="bottom">Buy</TextMark>
      </Mark>
    );
    const points = [startPointDOM];
    for (let i = 0; i < freeShippingPoints.length; i++) {
      const freeShippingPoint = freeShippingPoints[i];
      const missing = freeShippingPoint.value - totalGuess;
      const achieved = (freeShippingPoint.value / finishPoint.value) * 100;
      const pointDOM = (
        <Tooltip
          key={i + 1}
          placement="top"
          title={
            missing > 0
              ? `Let's buy more ${toVND(missing)} to get free delivery of ${toVND(
                  freeShippingPoint.minus
                )}`
              : 'Got it'
          }
          arrow
        >
          <Mark position="end" achieved={achieved}>
            {totalGuess >= freeShippingPoint.value && (
              <Check color="success" sx={{ fontSize: '14px' }} />
            )}
            <TextMark location="top">-{toAbbreviated(freeShippingPoint.minus)}</TextMark>
            <TextMark location="bottom">{toAbbreviated(freeShippingPoint.value)}</TextMark>
          </Mark>
        </Tooltip>
      );
      points.push(pointDOM);
    }
    return (
      <Points>
        <ProgressBar achieved={totalAchieved < 100 ? totalAchieved : 100}>{points}</ProgressBar>
      </Points>
    );
  };

  const handleChangeQuantity = (
    cartId: ICart.CartItem['_id'],
    productId: IProduct.Product['_id'],
    newQuantity: string
  ) => {
    dispatch(
      editQuantity({
        _id: cartId,
        product_id: productId,
        new_quantity: parseInt(newQuantity),
      })
    );
  };
  const handleCheckCartItem = (params: ICart.SwitchSelectBody) => {
    dispatch(switchSelect(params));
  };
  const handleRemoveCartItem = async (_id?: ICart.CartItem['_id']) => {
    // _id with null will remove all selected items
    if (!_id) {
      const isSelectedMany = items.filter((item) => item.selected).length > 0;
      if (!isSelectedMany) {
        enqueueNotify('Please select the products to remove', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          preventDuplicate: true,
        });
        return;
      }
    }
    try {
      await confirm({
        title: 'Remove products',
        content: <Alert severity="error">Do you want to remove these selected products?</Alert>,
        confirmationButtonProps: {
          color: 'error',
        },
      });
      dispatch(
        removeCart({
          _id,
        })
      );
    } catch (error) {
      if (error === undefined) return;
      console.log('Confirm error:', error);
    }
  };
  return (
    <Root>
      <Anchor>
        <Heading>
          <Stack spacing={1} direction="row" alignItems="center" sx={{ cursor: 'pointer' }}>
            <Checkbox
              size="small"
              checked={isSelectedAll}
              checkedIcon={<Favorite />}
              onClick={() => handleCheckCartItem({ _id: !isSelectedAll })}
            />
            <Typography variant="subtitle2">All ({items.length} products)</Typography>
          </Stack>
          <Hidden breakpoint="md" type="Down">
            <Typography variant="subtitle2">Single</Typography>
            <Typography variant="subtitle2">Quantity</Typography>
            <Typography variant="subtitle2">Price</Typography>
          </Hidden>
          <Tooltip placement="bottom" title="Remove selected items" arrow>
            <IconButton color="primary" onClick={() => handleRemoveCartItem()}>
              <DeleteForeverOutlined />
            </IconButton>
          </Tooltip>
        </Heading>
        {freeShippingPoints?.length > 0 && renderPoints()}
      </Anchor>
      <Stack spacing={2}>
        <ContentGroup>
          {/* Seller */}
          {/* Intended */}
          <Stack spacing={3}>
            {items.map((item) => {
              const { _id } = item;
              return (
                <CartItem
                  key={_id}
                  item={item}
                  handleChangeQuantity={handleChangeQuantity}
                  handleCheckCartItem={handleCheckCartItem}
                  handleRemoveCartItem={handleRemoveCartItem}
                />
              );
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

const Anchor = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  top: `calc(${STYLE.DESKTOP.HEADER.HEIGHT} + 10px)`,
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

const Heading = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: STYLE.DESKTOP.CART.GRID_TEMPLATE_COLUMNS,
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px',
  padding: '5px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: STYLE.MOBILE.CART.GRID_TEMPLATE_COLUMNS,
  },
}));

const ContentGroup = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px',
  padding: '5px',
  marginTop: '10px',
}));

const Points = styled('div')(({ theme }) => ({
  padding: '30px',
  backgroundColor: theme.palette.background.paper,
}));

const ProgressBar = styled('div')<ProgressBarProps>(({ theme, achieved }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  '&:before': {
    content: '""',
    position: 'absolute',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    borderRadius: '100px',
    height: '6px',
    transform: 'translateY(-50%)',
    top: '50%',
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    background: 'linear-gradient(90deg,rgb(0, 173, 87) 0%, rgb(119, 218, 144) 105.65%)',
    borderRadius: '100px',
    width: `${achieved}%`,
    height: '6px',
    transform: 'translateY(-50%)',
    top: '50%',
    transition: 'width 0.5s ease-in 0s',
  },
}));

const Mark = styled('div')<MarkProps>(({ theme, position, achieved }) => ({
  position: 'absolute',
  left: `calc(${achieved}% - 8px)`, // width / 2
  display: 'flex',
  justifyContent: 'center',
  zIndex: 2,
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: `${
    position === 'first'
      ? 'rgba(0,0,0,0)'
      : achieved
      ? 'rgb(214, 250, 223)'
      : theme.palette.background.paper
  }`,
  border: `${position !== 'first' ? '1px solid rgb(221, 221, 227)' : 'none'}`,
}));

const TextMark = styled('div')<TextMarkProps>(({ theme, location }) => ({
  position: 'absolute',
  top: `${location === 'top' ? '-16px' : '16px'}`,
  fontSize: '11px',
  color: theme.palette.text.primary,
  fontWeight: '500',
}));

export default CartList;

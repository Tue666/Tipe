import { Check, DeleteForeverOutlined, Favorite } from '@mui/icons-material';
import { Checkbox, IconButton, Stack, Tooltip, Typography, Alert, styled } from '@mui/material';
import CartItem from './CartItem.component';
import { Hidden } from '@/components';
import {
  EVENT_FREE_SHIPPING_LEVEL_1,
  EVENT_FREE_SHIPPING_LEVEL_2,
  STYLE,
} from '@/configs/constants';
import { ICart } from '@/models/interfaces';
import { useAppDispatch } from '@/redux/hooks';
import { CartState, removeCart, switchSelect } from '@/redux/slices/cart.slice';
import { useConfirm } from 'material-ui-confirm';
import { toAbbreviated, toVND } from '@/utils';

interface ProgressBarProps {
  achieved: number;
}

interface MarkProps {
  position: 'first' | 'end';
  achieved?: boolean;
}

interface TextMarkProps {
  location: 'top' | 'bottom';
}

interface CartListProps extends CartState {}

const CartList = (props: CartListProps) => {
  const { items, statistics } = props;
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const isSelectedAll = items.filter((item) => !item.selected).length === 0;
  const totalGuess = statistics['guess'].value;

  const handleCheckCartItem = (params: ICart.SwitchSelectBody) => {
    dispatch(switchSelect(params));
  };
  const handleRemoveCartItem = async (_id?: ICart.CartItem['_id']) => {
    // _id with null will remove all selected items
    if (!_id) {
      const isSelectedMany = items.filter((item) => item.selected).length > 0;
      if (!isSelectedMany) {
        console.log('Please select the products to remove');
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
      console.log('Confirm error:', error);
    }
  };
  return (
    <Root>
      <Heading>
        <Stack spacing={1} direction="row" alignItems="center" sx={{ cursor: 'pointer' }}>
          <Checkbox
            size="small"
            checked={isSelectedAll}
            checkedIcon={<Favorite />}
            color="error"
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
          <IconButton color="error" onClick={() => handleRemoveCartItem()}>
            <DeleteForeverOutlined />
          </IconButton>
        </Tooltip>
        <ProgressBar
          achieved={
            (totalGuess * 100) / EVENT_FREE_SHIPPING_LEVEL_2.REACH <= 100
              ? (totalGuess * 100) / EVENT_FREE_SHIPPING_LEVEL_2.REACH
              : 100
          }
        >
          <Mark position="first">
            <TextMark location="bottom">Buy</TextMark>
          </Mark>
          <Tooltip
            placement="top"
            title={`Let's buy ${toVND(
              EVENT_FREE_SHIPPING_LEVEL_1.REACH - totalGuess
            )} to get free delivery of ${toAbbreviated(EVENT_FREE_SHIPPING_LEVEL_1.FREE_SHIP)}`}
            arrow
          >
            <Mark position="end" achieved={totalGuess >= EVENT_FREE_SHIPPING_LEVEL_1.REACH}>
              {totalGuess >= EVENT_FREE_SHIPPING_LEVEL_1.REACH && (
                <Check color="success" sx={{ fontSize: '14px' }} />
              )}
              <TextMark location="top">
                -{toAbbreviated(EVENT_FREE_SHIPPING_LEVEL_1.FREE_SHIP)}
              </TextMark>
              <TextMark location="bottom">
                {toAbbreviated(EVENT_FREE_SHIPPING_LEVEL_1.REACH)}
              </TextMark>
            </Mark>
          </Tooltip>
          <Tooltip
            placement="top"
            title={`Let's buy ${toVND(
              EVENT_FREE_SHIPPING_LEVEL_2.REACH - totalGuess
            )} to get free delivery of ${toAbbreviated(EVENT_FREE_SHIPPING_LEVEL_2.FREE_SHIP)}`}
            arrow
          >
            <Mark position="end" achieved={totalGuess >= EVENT_FREE_SHIPPING_LEVEL_2.REACH}>
              {totalGuess >= EVENT_FREE_SHIPPING_LEVEL_2.REACH && (
                <Check color="success" sx={{ fontSize: '14px' }} />
              )}
              <TextMark location="top">
                -{toAbbreviated(EVENT_FREE_SHIPPING_LEVEL_2.FREE_SHIP)}
              </TextMark>
              <TextMark location="bottom">
                {toAbbreviated(EVENT_FREE_SHIPPING_LEVEL_2.REACH)}
              </TextMark>
            </Mark>
          </Tooltip>
        </ProgressBar>
      </Heading>
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

const ProgressBar = styled('div')<ProgressBarProps>(({ theme, achieved }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  width: `calc(${STYLE.DESKTOP.CART.LIST_WIDTH} - 100px)`,
  margin: '17px 20px',
  '&:before': {
    content: '""',
    position: 'absolute',
    backgroundColor: theme.palette.background.default,
    borderRadius: '100px',
    width: `calc(${STYLE.DESKTOP.CART.LIST_WIDTH} - 100px)`,
    height: '6px',
    transform: 'translateY(-50%)',
    top: '50%',
    zIndex: 0,
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
    zIndex: 1,
    transition: 'width 0.5s ease-in 0s',
  },
  [theme.breakpoints.down('md')]: {
    width: `calc(${STYLE.MOBILE.CART.LIST_WIDTH} - 100px)`,
    '&:before': {
      width: `calc(${STYLE.MOBILE.CART.LIST_WIDTH} - 100px)`,
    },
  },
}));

const Mark = styled('div')<MarkProps>(({ theme, position, achieved }) => ({
  position: 'relative',
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

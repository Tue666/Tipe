import { isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import { Alert, Button, Divider, Stack, Typography, styled } from '@mui/material';
import { Link } from '../overrides';
import { STYLE } from '@/configs/constants';
import { productAvailable, toVND } from '@/utils';
import {
  StatisticsGroup,
  CartState,
  getSelectedItems,
  removeSelected,
} from '@/redux/slices/cart.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { PATH_CHECKOUT, PATH_MAIN } from '@/configs/routers';
import { IOrder, ISchema } from '@/models/interfaces';
import useModal from '@/hooks/useModal';
import { useConfirm } from 'material-ui-confirm';
import orderApi from '@/apis/orderApi';
import { enqueueNotify } from '@/hooks/useSnackbar';

interface PriceStatisticsProps extends Pick<CartState, 'items' | 'statistics' | 'payment'> {}

const PriceStatistics = (props: PriceStatisticsProps) => {
  const { items, statistics, payment } = props;
  const { addresses } = useAppSelector(selectCustomer);
  const dispatch = useAppDispatch();
  const { pathname, push } = useRouter();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const selectedCount = items.filter((item) => {
    const { selected, product } = item;
    return selected && productAvailable(product.inventory_status, product.quantity);
  }).length;
  const priceSummary: ISchema.PriceSummary[] = [];
  const totalPrice = (Object.keys(statistics) as Array<StatisticsGroup>).reduce((sum, group) => {
    const { value, sign } = statistics[group];
    const price = value * sign;
    if (value > 0)
      priceSummary.push({
        name: group,
        value: price,
      });
    return sum + price;
  }, 0);
  const defaultAddress = addresses.find((address) => address.is_default);
  const isIntendedCart = pathname.indexOf(PATH_MAIN.cart) !== -1;
  const hrefToShipping = `${PATH_CHECKOUT.shipping}${isIntendedCart ? '?is_intended_cart=1' : ''}`;

  const handleOpenAppPromotion = () => {
    openModal({ key: 'appPromotion' });
  };
  const validateInformation = (isOrder: boolean = false): boolean => {
    // Validate information before order
    const prepareChange = {
      hasError: false,
      errorMessage: '',
    };
    if (!defaultAddress) {
      prepareChange.hasError = true;
      prepareChange.errorMessage = 'You have not set address for order yet';
    }
    if (selectedCount < 1) {
      prepareChange.hasError = true;
      prepareChange.errorMessage = 'You have not selected any products to order yet';
    }
    if (isOrder && !payment.method_key) {
      prepareChange.hasError = true;
      prepareChange.errorMessage = 'You have not selected any payment method';
    }
    if (prepareChange.hasError) {
      enqueueNotify(prepareChange.errorMessage, {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        preventDuplicate: true,
      });
      return false;
    }
    return true;
  };
  const handleCheckOut = () => {
    const isOk = validateInformation();
    if (!isOk) return;

    if (defaultAddress) push(PATH_CHECKOUT.payment);
    else push(hrefToShipping);
  };
  const handleOrder = async () => {
    const isOk = validateInformation(true);
    if (!isOk) return;

    try {
      await confirm({
        title: 'Order',
        content: <Alert severity="info">Checked the products and confirmed the order</Alert>,
      });

      const { region, district, ward, is_default, ...rest } = defaultAddress!;
      const orderItems = getSelectedItems(items).map((item) => {
        const { quantity, product } = item;
        return {
          ...product,
          quantity,
        };
      });

      const insertBody: IOrder.InsertBody = {
        shipping_address: {
          region: region.name,
          district: district.name,
          ward: ward.name,
          ...rest,
        },
        payment_method: payment,
        items: orderItems,
        price_summary: priceSummary,
      };

      const { orderedItems } = await orderApi.insert(insertBody);
      dispatch(removeSelected(orderedItems));

      switch (payment.method_key) {
        case 'momo':
        case 'vnpay':
        case 'international':
          break;
        default:
          push(`${PATH_CHECKOUT.result}?status=200`);
          break;
      }
    } catch (error) {
      if (error === undefined) return;
      if (isAxiosError(error) && error.response) {
        const { status } = error.response;
        push(`${PATH_CHECKOUT.result}?status=${status}`);
      } else {
        push(`${PATH_CHECKOUT.result}?status=500`);
      }
    }
  };
  return (
    <Root>
      <ContentInner>
        {defaultAddress && (
          <Wrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Ship Address</Typography>
              <Linking href={hrefToShipping}>Change</Linking>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {defaultAddress.name} | {defaultAddress.phone_number}
            </Typography>
            <Typography variant="body2">{`${defaultAddress.street}, ${defaultAddress.ward.name}, ${defaultAddress.district.name}, ${defaultAddress.region.name}`}</Typography>
          </Wrapper>
        )}
        <Wrapper>
          <Typography variant="subtitle2">Tipe Promotion</Typography>
          <Typography
            variant="subtitle2"
            onClick={handleOpenAppPromotion}
            sx={{ fontWeight: 'bold', color: 'rgb(26 139 237)', cursor: 'pointer' }}
          >
            <i className="bi bi-ticket-detailed"></i> Select or enter another Promotion
          </Typography>
        </Wrapper>
        <Wrapper>
          {(Object.keys(statistics) as Array<StatisticsGroup>).map((group, index) => {
            const { value, sign } = statistics[group];
            return (
              <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                  {group}
                </Typography>
                <Typography variant="subtitle1">{toVND(value * sign)}</Typography>
              </Stack>
            );
          })}
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Total</Typography>
            <Stack alignItems="end">
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                {selectedCount > 0 ? toVND(totalPrice) : 'Choose a product, please!'}
              </Typography>
              <Typography variant="caption">(VAT includes)</Typography>
            </Stack>
          </Stack>
        </Wrapper>
        {isIntendedCart && selectedCount > 0 && (
          <Button
            variant="contained"
            disableElevation
            sx={{ width: '100%' }}
            onClick={handleCheckOut}
          >
            Check out ({selectedCount})
          </Button>
        )}
        {!isIntendedCart && (
          <Button variant="contained" disableElevation sx={{ width: '100%' }} onClick={handleOrder}>
            Order
          </Button>
        )}
      </ContentInner>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  width: `calc(100% - calc(${STYLE.DESKTOP.CART.LIST_WIDTH} + 7px))`,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ContentInner = styled('div')(() => ({
  position: 'sticky',
  top: `calc(${STYLE.DESKTOP.HEADER.HEIGHT} + 10px)`,
}));

const Wrapper = styled('div')(({ theme }) => ({
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: theme.palette.background.paper,
  fontSize: '14px',
}));

const Linking = styled(Link)({
  color: 'rgb(26 139 237)',
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: '500',
});

export default PriceStatistics;

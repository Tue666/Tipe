import { ChangeEvent } from 'react';
import {
  styled,
  Stack,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import Ellipsis from '../Ellipsis.component';
import { STYLE } from '@/configs/constants';
import { ICart, ISchema } from '@/models/interfaces';
import { Image } from '../overrides';
import { buildImageLink, toVND } from '@/utils';
import { PATH_IMAGE } from '@/configs/routers';
import { changePayment } from '@/redux/slices/cart.slice';
import { useAppDispatch } from '@/redux/hooks';
import { enqueueNotify } from '@/hooks/useSnackbar';

interface PaymentMethodProps extends ISchema.Payment {
  icon: string;
  render: (label: PaymentMethodProps['method_text']) => JSX.Element;
}

const PAYMENTS: PaymentMethodProps[] = [
  {
    method_key: 'cash',
    method_text: 'Cash payment upon receipt',
    icon: `${PATH_IMAGE.icons}/payment/cash.png`,
    render: (label: string) => <Typography variant="subtitle2">{label}</Typography>,
  },
  {
    method_key: 'momo',
    method_text: 'Pay by Momo wallet',
    icon: `${PATH_IMAGE.icons}/payment/momo.png`,
    render: (label: string) => <Typography variant="subtitle2">{label}</Typography>,
  },
  {
    method_key: 'vnpay',
    method_text: 'Pay by VNPAY',
    icon: `${PATH_IMAGE.icons}/payment/vnpay.png`,
    render: (label: string) => <Typography variant="subtitle2">{label}</Typography>,
  },
  {
    method_key: 'international',
    method_text: 'Payment by international card Visa, Credit Card, Paypal',
    icon: `${PATH_IMAGE.icons}/payment/visa.png`,
    render: (label: string) => (
      <div>
        <Typography variant="subtitle2">{label}</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Image
            alt="visa"
            src={`${PATH_IMAGE.icons}/payment/visa.png`}
            sx={{ width: '18px', height: '18px' }}
          />
          <Image
            alt="credit"
            src={`${PATH_IMAGE.icons}/payment/credit.png`}
            sx={{ width: '18px', height: '18px' }}
          />
          <Image
            alt="paypal"
            src={`${PATH_IMAGE.icons}/payment/paypal.png`}
            sx={{ width: '18px', height: '18px' }}
          />
        </Stack>
      </div>
    ),
  },
];

interface PaymentSectionProps {
  paymentItems: ICart.CartItem[];
  payment: ISchema.Payment;
}

const PaymentSection = (props: PaymentSectionProps) => {
  const { paymentItems, payment } = props;
  const dispatch = useAppDispatch();

  const handleChangePayment = (e: ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value;
    const payment = PAYMENTS.find((payment) => payment.method_key === method);
    if (!payment) {
      enqueueNotify(`${method} not found`, {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        preventDuplicate: true,
      });
      return;
    }

    // Remove this when payment by external available
    if (payment.method_key !== 'cash') {
      enqueueNotify(
        `${payment.method_text} is under maintenance, please choose another payment method!`,
        {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          preventDuplicate: true,
        }
      );
      return;
    }

    dispatch(
      changePayment({
        method_key: payment.method_key,
        method_text: payment.method_text,
      })
    );
  };
  return (
    <Root spacing={2}>
      <Section spacing={1}>
        <Typography variant="subtitle2">Delivery items</Typography>
        {paymentItems?.length > 0 &&
          paymentItems.map((item) => {
            const { _id, quantity, product } = item;
            const { name, images, price } = product;
            return (
              <DeliveryItem key={_id}>
                <Image
                  alt={name}
                  src={buildImageLink(images[0])}
                  sx={{
                    width: STYLE.DESKTOP.CART.ITEM_IMAGE_SIZE,
                    height: STYLE.DESKTOP.CART.ITEM_IMAGE_SIZE,
                  }}
                />
                <Stack sx={{ flex: 1, ml: '10px' }}>
                  <Ellipsis variant="body2" text={name} />
                  <Typography variant="subtitle2">
                    {toVND(price)} | x{quantity}
                  </Typography>
                </Stack>
              </DeliveryItem>
            );
          })}
      </Section>
      <Section>
        <Typography variant="subtitle2">Payment methods</Typography>
        <FormControl>
          <RadioGroup value={payment.method_key} onChange={handleChangePayment}>
            {PAYMENTS.map((payment) => {
              const { method_key, icon, method_text, render } = payment;
              return (
                <FormControlLabel
                  key={method_key}
                  value={method_key}
                  control={<Radio disabled={method_key !== 'cash'} size="small" />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Image
                        alt={method_key ?? ''}
                        src={icon}
                        sx={{
                          width: '32px',
                          height: '32px',
                        }}
                      />
                      {method_key !== 'cash' && (
                        <Typography variant="subtitle2" color="error.main">
                          (Maintained)
                        </Typography>
                      )}
                      {render(method_text)}
                    </Stack>
                  }
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Section>
    </Root>
  );
};

const Root = styled(Stack)(({ theme }) => ({
  width: STYLE.DESKTOP.CART.LIST_WIDTH,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const Section = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px',
  padding: '15px',
}));

const DeliveryItem = styled('div')(({ theme }) => ({
  position: 'relative',
  border: `2px solid ${theme.palette.background.default}`,
  borderRadius: '5px',
  padding: '15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export default PaymentSection;

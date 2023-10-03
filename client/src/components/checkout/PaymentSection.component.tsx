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
import { ICart } from '@/models/interfaces';
import { Image } from '../overrides';
import { appConfig } from '@/configs/apis';
import { toVND } from '@/utils';
import { PATH_IMAGE } from '@/configs/routers';
import { Payment, changePayment } from '@/redux/slices/cart.slice';
import { useAppDispatch } from '@/redux/hooks';

interface PaymentMethodProps extends Payment {
  icon: string;
  render: (label: PaymentMethodProps['label']) => JSX.Element;
}

const PAYMENTS: PaymentMethodProps[] = [
  {
    method: 'cash',
    label: 'Cash payment upon receipt',
    icon: `${PATH_IMAGE.icons}/credit.png`,
    render: (label: string) => <Typography variant="subtitle2">{label}</Typography>,
  },
  {
    method: 'momo',
    label: 'Pay by Momo wallet',
    icon: `${PATH_IMAGE.icons}/credit.png`,
    render: (label: string) => <Typography variant="subtitle2">{label}</Typography>,
  },
  {
    method: 'vnpay',
    label: 'Pay by VNPAY',
    icon: `${PATH_IMAGE.icons}/credit.png`,
    render: (label: string) => <Typography variant="subtitle2">{label}</Typography>,
  },
  {
    method: 'international',
    label: 'Payment by international card Visa, Credit Card, Paypal',
    icon: `${PATH_IMAGE.icons}/visa.png`,
    render: (label: string) => (
      <div>
        <Typography variant="subtitle2">{label}</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Image
            alt="visa"
            src={`${PATH_IMAGE.icons}/visa.png`}
            sx={{ width: '18px', height: '18px' }}
          />
          <Image
            alt="credit"
            src={`${PATH_IMAGE.icons}/credit.png`}
            sx={{ width: '18px', height: '18px' }}
          />
          <Image
            alt="paypal"
            src={`${PATH_IMAGE.icons}/paypal.png`}
            sx={{ width: '18px', height: '18px' }}
          />
        </Stack>
      </div>
    ),
  },
];

interface PaymentSectionProps {
  paymentItems: ICart.CartItem[];
  payment: Payment;
}

const PaymentSection = (props: PaymentSectionProps) => {
  const { paymentItems, payment } = props;
  const dispatch = useAppDispatch();

  const handleChangePayment = (e: ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value;
    const payment = PAYMENTS.find((payment) => payment.method === method);
    if (!payment) {
      console.log(`${method} not found`);
      return;
    }

    dispatch(
      changePayment({
        method: payment.method,
        label: payment.label,
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
                  src={`${appConfig.image_storage_url}/${images[0]}`}
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
          <RadioGroup value={payment.method} onChange={handleChangePayment}>
            {PAYMENTS.map((payment) => {
              const { method, icon, label, render } = payment;
              return (
                <FormControlLabel
                  key={method}
                  value={method}
                  control={<Radio size="small" />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Image
                        alt={method ?? ''}
                        src={icon}
                        sx={{
                          width: '32px',
                          height: '32px',
                        }}
                      />
                      {render(label)}
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

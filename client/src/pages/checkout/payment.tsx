import { Stack } from '@mui/material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import CheckoutLayout from '@/layouts/checkout';
import { PaymentSection } from '@/components/checkout';
import { PriceStatistics } from '@/components/cart';
import { useAppSelector } from '@/redux/hooks';
import { getSelectedItems, selectCart } from '@/redux/slices/cart.slice';

const Payment: PageWithLayout = () => {
  const { items, statistics, payment } = useAppSelector(selectCart);
  const paymentItems = getSelectedItems(items);
  return (
    <Page title="Payment details | Tipe">
      <Stack
        direction={{ xs: 'column', sm: 'column', lg: 'row' }}
        justifyContent="space-between"
        my={2}
      >
        <PaymentSection paymentItems={paymentItems} payment={payment} />
        <PriceStatistics items={items} statistics={statistics} payment={payment} />
      </Stack>
    </Page>
  );
};

Payment.getLayout = (page) => {
  return <CheckoutLayout>{page}</CheckoutLayout>;
};

export default Payment;

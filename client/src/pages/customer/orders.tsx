import { InputAdornment, Pagination, Stack, Tab, Tabs, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import { OrderPanel } from '@/components/order';

const ORDER_TABS = [
  {
    value: 'all',
    label: 'ALL ORDERS',
  },
  {
    value: 'awaiting_payment',
    label: 'UNPAID',
  },
  {
    value: 'processing',
    label: 'PROCESSING',
  },
  {
    value: 'transporting',
    label: 'TRANSPORTING',
  },
  {
    value: 'delivered',
    label: 'DELIVERED',
  },
  {
    value: 'canceled',
    label: 'CANCELED',
  },
];

const Orders: PageWithLayout = () => {
  return (
    <Page title="Orders">
      <Stack spacing={1}>
        <Tabs
          value="all"
          variant="fullWidth"
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        >
          {ORDER_TABS.map((tab) => {
            const { value, label } = tab;
            return <Tab key={value} label={label} value={value} />;
          })}
        </Tabs>
        <Stack direction="row" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            color="secondary"
            placeholder="Find order by order number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          />
        </Stack>
        {ORDER_TABS.map((tab) => {
          const { value } = tab;
          return <OrderPanel key={value} />;
        })}
        <Pagination color="primary" sx={{ alignSelf: 'end' }} />
      </Stack>
    </Page>
  );
};

Orders.getLayout = (page) => {
  return (
    <MainLayout>
      <CustomerLayout>{page}</CustomerLayout>
    </MainLayout>
  );
};

export default Orders;

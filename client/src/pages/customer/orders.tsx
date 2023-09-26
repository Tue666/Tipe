import { InputAdornment, Pagination, Stack, Tab, Tabs, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';

const Orders: PageWithLayout = () => {
  return (
    <Page title="Orders">
      <Stack spacing={1}>
        <Tabs
          value={1}
          variant="fullWidth"
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        >
          {[...Array(5)].map((_, index) => {
            return <Tab key={index} label={index} value={index} />;
          })}
        </Tabs>
        <Stack direction="row" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
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
        {/* {ORDER_TABS.map((tab) => {
          const { value } = tab;
          const isActive = value === current.value;
          return isActive && <OrderPanel key={value} orders={state[current.value].orders} />;
        })} */}
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

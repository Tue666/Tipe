import { Fragment } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import CheckoutLayout from '@/layouts/checkout';
import { useAppSelector } from '@/redux/hooks';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { DeliveryAddress } from '@/components/checkout';

const Shipping: PageWithLayout = () => {
  const { addresses } = useAppSelector(selectCustomer);
  return (
    <Page title="Shipment details | Tipe">
      <Stack spacing={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          2. Delivery address
        </Typography>
        {addresses?.length > 0 && (
          <Fragment>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Choose from the available shipping addresses below:
            </Typography>
            <Grid container spacing={2}>
              {addresses.map((address) => {
                const { _id } = address;
                return (
                  <Grid key={_id} item md={6} sm={12} xs={12}>
                    <DeliveryAddress />
                  </Grid>
                );
              })}
            </Grid>
          </Fragment>
        )}
        <div>
          <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
            Want to deliver to another address?&nbsp;
          </Typography>
          <Typography
            variant="subtitle2"
            component="span"
            sx={{ fontWeight: 'bold', color: 'rgb(26 139 237)', cursor: 'pointer' }}
            onClick={() => {}}
          >
            Add new delivery address
          </Typography>
        </div>
      </Stack>
    </Page>
  );
};

Shipping.getLayout = (page) => {
  return <CheckoutLayout>{page}</CheckoutLayout>;
};

export default Shipping;

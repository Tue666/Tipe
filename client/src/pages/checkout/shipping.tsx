import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { Alert, Grid, Stack, Typography } from '@mui/material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import CheckoutLayout from '@/layouts/checkout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeAddress, selectCustomer, switchDefault } from '@/redux/slices/customer.slice';
import { DeliveryAddress } from '@/components/checkout';
import { useConfirm } from 'material-ui-confirm';
import { IAccount } from '@/models/interfaces';
import { PATH_CHECKOUT, PATH_CUSTOMER, PATH_MAIN } from '@/configs/routers';

const Shipping: PageWithLayout = () => {
  const { addresses } = useAppSelector(selectCustomer);
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const confirm = useConfirm();
  const isIntendedCart = searchParams.get('is_intended_cart');

  const handleNavigateAddress = (_id?: IAccount.Address['_id']) => {
    push(
      `${PATH_CUSTOMER.addressForm}?is_intended_shipping=1${
        isIntendedCart ? '&is_intended_cart=1' : ''
      }${_id ? `&_id=${_id}` : ''}`
    );
  };
  const handleSwitchAddress = (_id: IAccount.Address['_id']) => {
    dispatch(switchDefault(_id));
    if (isIntendedCart) push(PATH_MAIN.cart);
    else push(PATH_CHECKOUT.payment);
  };
  const handleRemoveAddress = async (_id: IAccount.Address['_id']) => {
    try {
      await confirm({
        title: 'Remove address',
        content: <Alert severity="error">Do you want to remove the selected address?</Alert>,
        confirmationButtonProps: {
          color: 'error',
        },
      });
      dispatch(removeAddress(_id));
    } catch (error) {
      console.log(error);
    }
  };
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
                    <DeliveryAddress
                      address={address}
                      handleNavigateAddress={handleNavigateAddress}
                      handleSwitchAddress={handleSwitchAddress}
                      handleRemoveAddress={handleRemoveAddress}
                    />
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
            onClick={() => handleNavigateAddress()}
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

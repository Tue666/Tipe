import { Button, Stack, Typography } from '@mui/material';
import { Breadcrumbs, Page } from '@/components';
import { Image, Link } from '@/components/overrides';
import { appConfig } from '@/configs/apis';
import { CartList, PriceStatistics } from '@/components/cart';

const Cart = () => {
  return (
    <Page title="Cart | Tipe">
      <Breadcrumbs />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cart
      </Typography>
      {10 > 0 && (
        <Stack direction={{ xs: 'column', sm: 'column', lg: 'row' }} justifyContent="space-between">
          <CartList />
          <PriceStatistics />
        </Stack>
      )}
      {10 <= 0 && (
        <Stack
          alignItems="center"
          spacing={1}
          sx={{ p: 5, backgroundColor: (theme) => theme.palette.background.paper }}
        >
          <Image
            src={`${appConfig.image_storage_url}/_external_/buy_more.png`}
            alt="buy_more"
            sx={{ width: '190px', height: '160px' }}
          />
          <Typography variant="subtitle2">There are no products in your cart.</Typography>
          <Link href="#">
            <Button color="warning" variant="contained" disableElevation>
              BUY NOW
            </Button>
          </Link>
        </Stack>
      )}
    </Page>
  );
};

export default Cart;

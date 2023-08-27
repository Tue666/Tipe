import { Button, Stack, Typography } from '@mui/material';
import { Breadcrumbs, Page } from '@/components';
import { Image, Link } from '@/components/overrides';
import { appConfig } from '@/configs/apis';
import { CartList, PriceStatistics } from '@/components/cart';
import { STYLE } from '@/configs/constants';

const Cart = () => {
  return (
    <Page title="Cart | Tipe">
      <Breadcrumbs current="Cart" />
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Check out what you've ordered 😉
      </Typography>
      {10 > 0 && (
        <Stack
          direction={{ xs: 'column', sm: 'column', lg: 'row' }}
          justifyContent="space-between"
          spacing={1}
        >
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
            sx={{
              width: STYLE.DESKTOP.CART.EMPTY_IMAGE_WIDTH,
              height: STYLE.DESKTOP.CART.EMPTY_IMAGE_HEIGHT,
            }}
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

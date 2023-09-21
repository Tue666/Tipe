import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import { Breadcrumbs, Page } from '@/components';
import { Image, Link } from '@/components/overrides';
import { appConfig } from '@/configs/apis';
import { CartList, PriceStatistics } from '@/components/cart';
import { STYLE } from '@/configs/constants';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/slices/cart.slice';
import { PATH_MAIN } from '@/configs/routers';

const Cart = () => {
  const { items, statistics } = useAppSelector(selectCart);
  return (
    <Page title="Cart | Tipe">
      <Breadcrumbs current="Cart" />
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {`Check out what you've ordered`}
      </Typography>
      {/* Events start */}
      <Alert severity="info">
        <AlertTitle>Promotional events</AlertTitle>
        Free shipping for orders from 50M <strong>(Jan 2023 - Dec 2023)</strong>
      </Alert>
      {/* Events end */}
      {items.length > 0 && (
        <Stack
          direction={{ xs: 'column', sm: 'column', lg: 'row' }}
          justifyContent="space-between"
          spacing={1}
        >
          <CartList items={items} statistics={statistics} />
          <PriceStatistics items={items} statistics={statistics} />
        </Stack>
      )}
      {items.length <= 0 && (
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
          <Link href={PATH_MAIN.home}>
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

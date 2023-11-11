import { useSearchParams } from 'next/navigation';
import { Button, Container, Stack } from '@mui/material';
import { PageWithLayout } from '../_app';
import CheckoutLayout from '@/layouts/checkout';
import { Image, Link } from '@/components/overrides';
import { PATH_CUSTOMER, PATH_IMAGE, PATH_MAIN } from '@/configs/routers';
import { STYLE } from '@/configs/constants';

const Result: PageWithLayout = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  return (
    <Container>
      <Stack
        alignItems="center"
        spacing={2}
        my={5}
        p={5}
        sx={{ bgcolor: (theme) => theme.palette.background.paper }}
      >
        <Image
          src={`${PATH_IMAGE.root}buy-more.png`}
          alt="buy-more"
          sx={{
            width: STYLE.DESKTOP.CART.EMPTY_IMAGE_WIDTH,
            height: STYLE.DESKTOP.CART.EMPTY_IMAGE_HEIGHT,
          }}
        />
        <Stack direction="row" alignItems="center" spacing={3}>
          {status && status === '200' && (
            <Link href={PATH_CUSTOMER.orders}>
              <Button color="success" variant="contained" size="small" disableElevation>
                REVIEW ORDERED
              </Button>
            </Link>
          )}
          {status && status !== '200' && (
            <a href="https://www.facebook.com/exe.shiro">
              <Button color="error" variant="contained" size="small" disableElevation>
                REPORT
              </Button>
            </a>
          )}
          <Link href={PATH_MAIN.home}>
            <Button color="warning" variant="contained" size="small" disableElevation>
              BUY MORE
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
};

Result.getLayout = (page) => {
  return <CheckoutLayout hasGuard={true}>{page}</CheckoutLayout>;
};

export default Result;

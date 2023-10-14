import { styled, Stack, Typography, Divider } from '@mui/material';
import { Image, Link } from '@/components/overrides';
import { STYLE } from '@/configs/constants';
import { PATH_IMAGE } from '@/configs/routers';

const CUSTOMER_SUPPORT = [
  'Hotline: 1999-9999 (1000 VND/minute, 8-21 hours including Saturday and Sunday)',
  'Frequently asked Questions',
  'Submit a support request',
  'Ordering guide',
  'Shipping method',
  'Return Policy',
  'Installment Instructions',
  'Import policy',
];

const SHOP = [
  'About shop',
  'Recruitment',
  'Payment Privacy Policy',
  'Privacy policy of personal information',
  'Complaint handling policy',
  'Terms of use',
];

const COOPERATION = ['Regulations on operation of E-commerce trading floor', 'Selling with Tipe'];

const CONNECT = [
  {
    src: `${PATH_IMAGE.icons}/social/facebook.png`,
    alt: 'facebook',
  },
  {
    src: `${PATH_IMAGE.icons}/social/youtube.png`,
    alt: 'youtube',
  },
  {
    src: `${PATH_IMAGE.icons}/social/zalo.png`,
    alt: 'zalo',
  },
];

const DOWNLOAD = [
  {
    src: `${PATH_IMAGE.icons}/download/app-store.png`,
    alt: 'app-store',
  },
  {
    src: `${PATH_IMAGE.icons}/download/play-store.png`,
    alt: 'play-store',
  },
];

const Footer = () => {
  return (
    <Root>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{
          xs: STYLE.MOBILE.FOOTER.BLOCK_SPACING,
          md: STYLE.DESKTOP.FOOTER.BLOCK_SPACING,
        }}
        sx={{ flexWrap: 'wrap' }}
      >
        <Blocks>
          <Typography variant="subtitle2">Customer support</Typography>
          {CUSTOMER_SUPPORT &&
            CUSTOMER_SUPPORT.map((item, index) => {
              return (
                <Typography key={index} variant="caption">
                  {item}
                </Typography>
              );
            })}
        </Blocks>
        <Blocks>
          <Typography variant="subtitle2">Shop</Typography>
          {SHOP &&
            SHOP.map((item, index) => {
              return (
                <Typography key={index} variant="caption">
                  {item}
                </Typography>
              );
            })}
        </Blocks>
        <Stack>
          <Blocks>
            <Typography variant="subtitle2">Cooperation and association</Typography>
            {COOPERATION &&
              COOPERATION.map((item, index) => {
                return (
                  <Typography key={index} variant="caption">
                    {item}
                  </Typography>
                );
              })}
          </Blocks>
          <Blocks>
            <Typography variant="subtitle2">Certified by</Typography>
            {/*  */}
          </Blocks>
        </Stack>
        <Blocks>
          <Typography variant="subtitle2">Payment methods</Typography>
          {/*  */}
        </Blocks>
        <Stack>
          <Blocks>
            <Typography variant="subtitle2">Connect with us</Typography>
            <Grid>
              {CONNECT &&
                CONNECT.map((item, index) => {
                  const { src, alt } = item;
                  return (
                    <Link key={index} href="/">
                      <Image
                        key={index}
                        src={src}
                        alt={alt}
                        sx={{
                          width: STYLE.DESKTOP.FOOTER.ICON_SIZE,
                          height: STYLE.DESKTOP.FOOTER.ICON_SIZE,
                          '& > img': {
                            borderRadius: '50%',
                          },
                        }}
                      />
                    </Link>
                  );
                })}
            </Grid>
          </Blocks>
          <Blocks>
            <Typography variant="subtitle2">Download the app</Typography>
            <Grid>
              {DOWNLOAD &&
                DOWNLOAD.map((item, index) => {
                  const { src, alt } = item;
                  return (
                    <Link key={index} href="/">
                      <Image
                        key={index}
                        src={src}
                        alt={alt}
                        sx={{
                          width: STYLE.DESKTOP.FOOTER.REC_WIDTH,
                          height: STYLE.DESKTOP.FOOTER.REC_HEIGHT,
                        }}
                      />
                    </Link>
                  );
                })}
            </Grid>
          </Blocks>
        </Stack>
      </Stack>
      <Divider />
      <Inlines>
        <Typography variant="caption">
          Office address: abcxyz, Ward 4, District 8, Ho Chi Minh City
        </Typography>
        <Typography variant="caption">
          Receive online orders and deliver to your door, not yet support to buy and receive goods
          directly at the office or order processing center
        </Typography>
        <Typography variant="caption">
          Business Registration Certificate No. 0309532909 issued by the Department of Planning and
          Investment of Ho Chi Minh City on 06/01/2010
        </Typography>
        <Typography variant="caption">© 2021 - Copyright by Tipe Company - abc.xyz</Typography>
      </Inlines>
      <Divider />
      <Inlines>
        <Typography variant="subtitle1">So fast, so good, so cheap</Typography>
        <Typography variant="subtitle2">Have everything</Typography>
        <Typography variant="caption">
          With millions of products from reputable brands and stores, thousands of items from
          Smartphones to Fresh Fruits and Vegetables, along with ShopNOW super-fast delivery
          service, shop brings you a shopping experience. online starts with credit. In addition, at
          shop you can easily use countless other utilities such as buying scratch cards, paying
          electricity and water bills, insurance services.
        </Typography>
        <Typography variant="subtitle2">Promotions and offers are overflowing</Typography>
        <Typography variant="caption">
          You want to hunt for a shocking price, Shop has a shocking price every day for you! You
          are a fan of brands, genuine Official stores are waiting for you. No need to hunt for
          freeship codes, because shop already has millions of products in the Freeship+ program,
          unlimited bookings, saving your precious time. Buy more ShopNOW savings packages to
          receive 100% free shipping 2h same day, or buy premium ShopNOW packages to receive 100%
          freeship, applicable to 100% products, 100% provinces in Vietnam. Want to save even more?
          Already have ShopCARD, shop credit card refund 15% on all transactions (maximum refund
          600k/month).
        </Typography>
      </Inlines>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  marginTop: STYLE.DESKTOP.FOOTER.MARGIN_TOP,
  padding: STYLE.DESKTOP.FOOTER.PADDING,
  backgroundColor: theme.palette.background.paper,
}));

const Grid = styled('div')({
  paddingBlock: '10px',
  display: 'grid',
  gridTemplateColumns: `repeat(${STYLE.DESKTOP.FOOTER.GRID_REPEAT},1fr)`,
  gridGap: STYLE.DESKTOP.FOOTER.GRID_GAP,
});

const Blocks = styled(Stack)(({ theme }) => ({
  width: STYLE.DESKTOP.FOOTER.BLOCK_WIDTH,
  paddingBlock: theme.spacing(STYLE.DESKTOP.FOOTER.ROW_SPACING),
  [theme.breakpoints.down('md')]: {
    paddingBlock: theme.spacing(STYLE.MOBILE.FOOTER.ROW_SPACING),
  },
}));

const Inlines = styled(Stack)(({ theme }) => ({
  paddingBlock: theme.spacing(STYLE.DESKTOP.FOOTER.ROW_SPACING),
  [theme.breakpoints.down('md')]: {
    paddingBlock: theme.spacing(STYLE.MOBILE.FOOTER.ROW_SPACING),
  },
}));

export default Footer;

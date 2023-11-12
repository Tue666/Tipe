import _ from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Pagination, Skeleton, Stack, Typography, styled, useTheme } from '@mui/material';
import { Page } from '@/components';
import { Image, Link } from '@/components/overrides';
import ProductCardFlashSale from '@/components/ProductCardFlashSale.component';
import FlipCountdownTimer from '@/components/FlipCountdownTimer.component';
import { flashSaleApi, productApi } from '@/apis';
import { IFlashSale, IProduct } from '@/models/interfaces';
import { LIMIT_FLASH_SALE_NUMBER, STYLE } from '@/configs/constants';
import { PATH_IMAGE, PATH_MAIN } from '@/configs/routers';

interface SessionProps {
  active?: boolean;
}

const HEADER_HEIGHT = '60px';

const FlashSale = () => {
  const [sessions, setSessions] = useState<IFlashSale.FindResponse['sessions']>([]);
  const [flashSaleProducts, setFlashSaleProducts] =
    useState<IProduct.FindForFlashSaleResponse | null>(null);
  const theme = useTheme();
  const { query, isReady } = useRouter();
  const { flash_sale_id, newest } = query;
  console.log('flash-sale render');

  useEffect(() => {
    const findForFlashSale = async () => {
      const flashSale = await flashSaleApi.find();
      const { sessions } = flashSale;
      if (sessions.length <= 0) {
        setFlashSaleProducts({
          products: [],
          pagination: {
            currentPage: 0,
            totalPage: 0,
          },
        });
        return;
      }

      setSessions(sessions);
      const flashSaleProducts = await productApi.findForFlashSale({
        flash_sale_id: (flash_sale_id as string | undefined) ?? sessions[0]._id,
        limit: LIMIT_FLASH_SALE_NUMBER,
      });
      setFlashSaleProducts(flashSaleProducts);
    };

    isReady && findForFlashSale();

    return () => setFlashSaleProducts(null);
  }, [newest, isReady]);
  return (
    <Page title="Flash Sale - Good Prices, Great Deals | Tipe Shop">
      {sessions.length > 0 && (
        <Fragment>
          <Header justifyContent="center" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Image
                src={`${PATH_IMAGE.icons}/app/flash-sale.png`}
                alt="flash-sale"
                sx={{
                  width: '130px',
                  height: '23px',
                }}
              />
              <Typography sx={{ textTransform: 'uppercase' }}>
                <i className="bi bi-stopwatch" /> End In
              </Typography>
              <FlipCountdownTimer />
            </Stack>
          </Header>
          <Image
            src="https://down-vn.img.susercontent.com/file/vn-11134004-7r98o-lnwuy1812dmi1c"
            alt="banner-flash-sale"
            sx={{
              width: '100%',
              height: '220px',
              [theme.breakpoints.down('md')]: {
                height: '140px',
              },
            }}
          />
          <Sessions direction="row" mb={2}>
            <Session active={true}>21:00</Session>
            <Session>21:00</Session>
            <Session>21:00</Session>
            <Session>21:00</Session>
          </Sessions>
        </Fragment>
      )}
      {sessions.length <= 0 && (
        <Stack
          alignItems="center"
          spacing={1}
          sx={{ p: 5, backgroundColor: (theme) => theme.palette.background.paper }}
        >
          <Image
            src={`${PATH_IMAGE.root}buy-more.png`}
            alt="buy-more"
            sx={{
              width: STYLE.DESKTOP.CART.EMPTY_IMAGE_WIDTH,
              height: STYLE.DESKTOP.CART.EMPTY_IMAGE_HEIGHT,
            }}
          />
          <Typography variant="subtitle2">
            There is currently no any Flash Sale, we will notify you as soon as the event starts.
          </Typography>
          <Link href={PATH_MAIN.home}>
            <Button color="warning" variant="contained" disableElevation>
              BUY NOW
            </Button>
          </Link>
        </Stack>
      )}
      {!_.isNil(flashSaleProducts) &&
        (() => {
          const { products, pagination } = flashSaleProducts;
          const { currentPage, totalPage } = pagination;
          return (
            <Fragment>
              <ProductWrapper>
                {products.map((product, index) => {
                  return <ProductCardFlashSale key={index} product={product} />;
                })}
              </ProductWrapper>
              {products?.length > 0 && (
                <Stack alignItems="end" mt={2}>
                  <Pagination
                    color="primary"
                    page={currentPage}
                    count={totalPage}
                    hidePrevButton={currentPage <= 1}
                    hideNextButton={currentPage >= totalPage}
                  />
                </Stack>
              )}
            </Fragment>
          );
        })()}
      {_.isNil(flashSaleProducts) && (
        <ProductWrapper>
          {[...Array(15)].map((_, index) => {
            return (
              <Stack key={index} sx={{ p: 2 }}>
                <Skeleton variant="rectangular" width={180} height={180} />
                <Skeleton variant="text" height={45} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={130} />
              </Stack>
            );
          })}
        </ProductWrapper>
      )}
    </Page>
  );
};

const Header = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  zIndex: 99,
  top: STYLE.DESKTOP.HEADER.HEIGHT,
  height: HEADER_HEIGHT,
  backgroundColor: theme.palette.background.paper,
  opacity: '0.95',
}));

const Sessions = styled(Stack)({
  position: 'sticky',
  zIndex: 99,
  top: `calc(${STYLE.DESKTOP.HEADER.HEIGHT} + ${HEADER_HEIGHT})`,
});

const Session = styled('div')<SessionProps>(({ theme, active = false }) => ({
  flex: 1,
  padding: '10px',
  textAlign: 'center',
  backgroundColor: active ? theme.palette.primary.main : '#414142',
  color: active ? theme.palette.background.paper : '#c3c3c3',
  fontSize: '22px',
  fontWeight: 'bold',
  cursor: 'pointer',
}));

const ProductWrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export default FlashSale;

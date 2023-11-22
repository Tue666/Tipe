import _ from 'lodash';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Alert,
  Button,
  Pagination,
  Skeleton,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { Page } from '@/components';
import { Carousel } from '@/components/_external_/react-slick';
import { Image, Link } from '@/components/overrides';
import ProductCardFlashSale from '@/components/ProductCardFlashSale.component';
import FlipCountdownTimer from '@/components/FlipCountdownTimer.component';
import { flashSaleApi, productApi } from '@/apis';
import { IFlashSale, IProduct } from '@/models/interfaces';
import { LIMIT_FLASH_SALE_NUMBER, STYLE } from '@/configs/constants';
import { PATH_IMAGE, PATH_MAIN } from '@/configs/routers';
import { buildImageLink } from '@/utils';

interface SessionProps {
  on_going?: boolean;
  selected?: boolean;
}

const HEADER_HEIGHT = '60px';

interface Time
  extends Pick<IFlashSale.FlashSaleSession, '_id' | 'start_time' | 'end_time' | 'on_going'> {}

type SessionMapping = {
  [K: IFlashSale.FlashSaleSession['_id']]: Omit<IFlashSale.FlashSaleSession, '_id'>;
};

interface Sessions {
  currentSelected: IFlashSale.FlashSaleSession['_id'];
  times: Time[];
  sessionMapping: SessionMapping;
}

const FlashSale = () => {
  const [sessions, setSessions] = useState<Sessions>({} as Sessions);
  const [flashSaleProducts, setFlashSaleProducts] =
    useState<IProduct.FindForFlashSaleResponse | null>(null);
  const theme = useTheme();
  const confirm = useConfirm();
  const { query, isReady, push } = useRouter();
  const { flash_sale_id, newest } = query;

  useEffect(() => {
    const findForFlashSale = async () => {
      const flashSale = await flashSaleApi.findForSessions();
      const { sessions } = flashSale;
      if (sessions.length <= 0) {
        return;
      }

      const currentSelected = (flash_sale_id as string | undefined) ?? sessions[0]._id;
      const times: Time[] = [];
      const sessionMapping = {};
      sessions.forEach((session) => {
        const { _id, ...rest } = session;
        const { start_time, end_time, on_going } = rest;
        times.push({ _id, start_time, end_time, on_going });
        (sessionMapping as SessionMapping)[_id] = rest;
      });
      setSessions({
        currentSelected,
        times,
        sessionMapping,
      });
      const flashSaleProducts = await productApi.findForFlashSale({
        flash_sale_id: (flash_sale_id as string | undefined) ?? sessions[0]._id,
        limit: LIMIT_FLASH_SALE_NUMBER,
      });
      setFlashSaleProducts(flashSaleProducts);
    };

    isReady && findForFlashSale();

    return () => setFlashSaleProducts(null);
  }, [flash_sale_id, newest, isReady]);

  const handleChangeSession = (flash_sale_id: IFlashSale.FlashSaleSession['_id']) => {
    push(`${PATH_MAIN.flashSale(flash_sale_id)}`);
  };
  const handleChangePage = (e: ChangeEvent<unknown>, newPage: number) => {
    const newest = (newPage - 1) * LIMIT_FLASH_SALE_NUMBER;
    push(
      `${PATH_MAIN.flashSale(flash_sale_id as IFlashSale.FlashSaleSession['_id'])}&newest=${newest}`
    );
  };
  const onCountdownExpired = async () => {
    try {
      await confirm({
        title: 'Expired',
        content: <Alert severity="error">This flash sale has expired, let's try another one</Alert>,
        confirmationButtonProps: {
          color: 'error',
        },
        allowClose: false,
        hideCancelButton: true,
      });

      const { flashSale } = await flashSaleApi.nextFlashSale();
      if (_.isNil(flashSale)) {
        window.location.href = PATH_MAIN.flashSale('').split('?')[0];
        return;
      }

      window.location.href = PATH_MAIN.flashSale(flashSale._id);
    } catch (error) {
      if (error === undefined) return;
      console.log('Confirm error:', error);
    }
  };
  return (
    <Page title="Flash Sale - Good Prices, Great Deals | Tipe Shop">
      {(sessions?.times ?? []).length > 0 &&
        (() => {
          const { currentSelected, times, sessionMapping } = sessions;
          const session = sessionMapping[currentSelected];
          const onGoingFlashSale = times.filter((time) => time.on_going);
          return (
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
                  {onGoingFlashSale.length > 0 && (
                    <Fragment>
                      <Typography sx={{ textTransform: 'uppercase' }}>
                        <i className="bi bi-stopwatch" /> End In
                      </Typography>
                      <FlipCountdownTimer
                        targetTime={onGoingFlashSale[0].end_time}
                        onExpired={onCountdownExpired}
                      />
                    </Fragment>
                  )}
                </Stack>
              </Header>
              {(session?.banners ?? []).length > 0 && (
                <Carousel
                  settings={{
                    infinite: STYLE.DESKTOP.BANNERS.SLIDE_INFINITE,
                    autoplay: STYLE.DESKTOP.BANNERS.SLIDE_AUTOPLAY,
                    dots: STYLE.DESKTOP.BANNERS.SLIDE_DOTS,
                    slidesToShow: STYLE.DESKTOP.BANNERS.SLIDE_TO_SHOW,
                    slidesToScroll: STYLE.DESKTOP.BANNERS.SLIDE_TO_SCROLL,
                    autoplaySpeed: STYLE.DESKTOP.BANNERS.SLIDE_AUTOPLAY_SPEED,
                  }}
                >
                  {session.banners.map((banner, index) => {
                    return (
                      <Image
                        key={index}
                        src={buildImageLink(banner)}
                        alt="banner-flash-sale"
                        sx={{
                          width: '100%',
                          height: '185px',
                          [theme.breakpoints.down('md')]: {
                            height: '140px',
                          },
                        }}
                      />
                    );
                  })}
                </Carousel>
              )}
              <Sessions direction="row" mb={2}>
                {times.map((time) => {
                  const { _id, start_time, on_going } = time;
                  const selected = currentSelected === _id;
                  return (
                    <Session
                      key={_id}
                      on_going={on_going}
                      selected={selected}
                      onClick={() => handleChangeSession(_id)}
                    >
                      {new Date(start_time).toLocaleTimeString()}
                      <Typography variant="subtitle2">
                        {on_going ? 'On Going' : 'Upcoming'}
                      </Typography>
                    </Session>
                  );
                })}
              </Sessions>
              {!_.isNil(flashSaleProducts) &&
                (() => {
                  const { products, pagination } = flashSaleProducts;
                  const { currentPage, totalPage } = pagination;
                  if (products.length <= 0) {
                    return (
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
                          There are no products for this Flash Sale session, please come back later.
                        </Typography>
                        <Link href={PATH_MAIN.home}>
                          <Button color="warning" variant="contained" disableElevation>
                            BUY SOMETHING ELSE
                          </Button>
                        </Link>
                      </Stack>
                    );
                  }

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
                            onChange={handleChangePage}
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
            </Fragment>
          );
        })()}
      {(sessions?.times ?? []).length <= 0 && (
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

const Session = styled('div')<SessionProps>(({ theme, on_going = false, selected = false }) => ({
  flex: 1,
  padding: '10px',
  textAlign: 'center',
  backgroundColor: on_going ? theme.palette.primary.main : selected ? '#2d2b2b' : '#414142',
  color: on_going ? theme.palette.background.paper : '#c3c3c3',
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

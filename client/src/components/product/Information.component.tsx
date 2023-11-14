import { Fragment, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Button, Stack, Tooltip, Typography, styled } from '@mui/material';
import { Stars, QuantityInput } from '@/components';
import { STYLE } from '@/configs/constants';
import { IProduct } from '@/models/interfaces';
import { toVND } from '@/utils';
import { Image, Link } from '../overrides';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addCart } from '@/redux/slices/cart.slice';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { PATH_CUSTOMER, PATH_IMAGE } from '@/configs/routers';
import FlipCountdownTimer from '../FlipCountdownTimer.component';

const WRAPPER_PADDING = '10px';
const MAX_WARRANTY_IN_LINE = 3;
const DEFENSE_ICONS = [
  {
    icon: 'app/defense-check.png',
    title: (
      <>
        Hoàn tiền <br /> <strong>111%</strong> <br /> nếu hàng giả
      </>
    ),
  },
  {
    icon: 'app/defense-like.png',
    title: (
      <>
        Mở hộp <br /> kiểm tra <br /> nhận hàng
      </>
    ),
  },
  {
    icon: 'app/defense-back.png',
    title: (
      <>
        Đổi trả trong <br /> <strong>7 ngày</strong> <br /> nếu sp lỗi
      </>
    ),
  },
];

interface PriceWrapperProps {
  tag: 'sale' | 'normal';
}

interface InformationProps
  extends Pick<
    IProduct.NestedProduct,
    | '_id'
    | 'name'
    | 'quantity'
    | 'warranties'
    | 'limit'
    | 'discount_rate'
    | 'original_price'
    | 'price'
    | 'quantity_sold'
    | 'ratings'
    | 'reviews'
    | 'inventory_status'
  > {}

const Information = (props: InformationProps) => {
  const {
    _id,
    name,
    quantity,
    warranties,
    limit,
    discount_rate,
    original_price,
    price,
    quantity_sold,
    ratings,
    reviews,
    inventory_status,
  } = props;
  const [input, setInput] = useState('1');
  const { addresses } = useAppSelector(selectCustomer);
  const dispatch = useAppDispatch();
  const defaultAddress = addresses.find((address) => address.is_default);
  const { rating_average } = ratings;
  const { review_count } = reviews;

  const handleClickAddToCart = () => {
    dispatch(
      addCart({
        product_id: _id,
        quantity: parseInt(input),
      })
    );
  };
  return (
    <Root>
      <Typography variant="h6">{name}</Typography>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {rating_average > 0 && (
            <Stars total={5} rating={rating_average} sx={{ fontSize: '18px' }} />
          )}
          {review_count > 0 && (
            <ScrollLink
              to="review"
              duration={500}
              offset={parseInt(STYLE.DESKTOP.HEADER.HEIGHT.slice(0, -2)) * -1}
            >
              <Typography variant="subtitle1" sx={{ fontSize: '14px', cursor: 'pointer' }}>
                (View {review_count} reviews)
              </Typography>
            </ScrollLink>
          )}
          {quantity_sold.value > 0 && (rating_average > 0 || review_count > 0) && <DivideLine />}
          {quantity_sold.value > 0 && (
            <Tooltip placement="right" title={quantity_sold.value} arrow>
              <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                {quantity_sold.text}
              </Typography>
            </Tooltip>
          )}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} spacing={1}>
          <Stack spacing={1} sx={{ flex: '2 1 0%' }}>
            <FlashSale direction="row" alignItems="center" justifyContent="space-between" px={1}>
              <svg viewBox="0 0 108 21" height="21" width="108" color="#fff">
                <g fill="currentColor" fillRule="evenodd">
                  <path d="M0 16.195h3.402v-5.233h4.237V8H3.402V5.037h5.112V2.075H0zm29.784 0l-.855-2.962h-4.335l-.836 2.962H20.26l4.723-14.12h3.576l4.724 14.12zM26.791 5.294h-.04s-.31 1.54-.563 2.43l-.797 2.744h2.74l-.777-2.745c-.252-.889-.563-2.43-.563-2.43zm7.017 9.124s1.807 2.014 5.073 2.014c3.13 0 4.898-2.034 4.898-4.384 0-4.463-6.259-4.147-6.259-5.925 0-.79.778-1.106 1.477-1.106 1.672 0 3.071 1.245 3.071 1.245l1.439-2.824s-1.477-1.6-4.47-1.6c-2.76 0-4.918 1.718-4.918 4.325 0 4.345 6.258 4.285 6.258 5.964 0 .85-.758 1.126-1.457 1.126-1.75 0-3.324-1.462-3.324-1.462zm12.303 1.777h3.402v-5.53h5.054v5.53h3.401V2.075h-3.401v5.648h-5.054V2.075h-3.402zm18.64-1.678s1.692 1.915 4.763 1.915c2.877 0 4.548-1.876 4.548-4.107 0-4.483-6.492-3.871-6.492-6.36 0-.987.914-1.678 2.08-1.678 1.73 0 3.052 1.224 3.052 1.224l1.088-2.073s-1.4-1.501-4.12-1.501c-2.644 0-4.627 1.738-4.627 4.068 0 4.305 6.512 3.87 6.512 6.379 0 1.145-.952 1.698-2.002 1.698-1.944 0-3.44-1.48-3.44-1.48zm19.846 1.678l-1.166-3.594h-4.84l-1.166 3.594H74.84L79.7 2.174h2.623l4.86 14.021zM81.04 4.603h-.039s-.31 1.382-.583 2.172l-1.224 3.752h3.615l-1.224-3.752c-.253-.79-.545-2.172-.545-2.172zm7.911 11.592h8.475v-2.192H91.46V2.173H88.95zm10.477 0H108v-2.192h-6.064v-3.772h4.645V8.04h-4.645V4.366h5.753V2.174h-8.26zM14.255.808l6.142.163-3.391 5.698 3.87 1.086-8.028 12.437.642-8.42-3.613-1.025z"></path>
                </g>
              </svg>
              <Stack direction="row" alignItems="start" spacing={1}>
                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#fff' }}>
                  <i className="bi bi-stopwatch" /> End In
                </Typography>
                <FlipCountdownTimer targetTime={1699862400000} />
              </Stack>
            </FlashSale>
            <PriceWrapper tag={discount_rate !== 0 ? 'sale' : 'normal'}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {discount_rate === 0 ? toVND(original_price) : toVND(price)}
              </Typography>
              {discount_rate !== 0 && (
                <Typography component="span">
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{
                      color: '#efefef',
                      fontSize: '15px',
                      textDecoration: 'line-through',
                      mx: '5px',
                    }}
                  >
                    {toVND(original_price)}
                  </Typography>
                  -{Math.round(discount_rate)}%
                </Typography>
              )}
            </PriceWrapper>
            <Link href={PATH_CUSTOMER.addresses}>
              <Stack>
                <Typography variant="subtitle2">Delivery</Typography>
                {defaultAddress && (
                  <Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
                    {defaultAddress.street}, {defaultAddress.ward.name},{' '}
                    {defaultAddress.district.name}, {defaultAddress.region.name}
                  </Typography>
                )}
                <Typography variant="subtitle2" sx={{ color: 'rgb(26 139 237)' }}>
                  {defaultAddress ? 'Change' : 'Add new'} delivery address
                </Typography>
              </Stack>
            </Link>
            {inventory_status === 'available' && (
              <Fragment>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Quantity</Typography>
                  <QuantityInput
                    isInCart={false}
                    input={input}
                    quantity={quantity}
                    limit={limit}
                    setInput={(newInput) => setInput(newInput)}
                  />
                </Stack>
                <Button variant="contained" onClick={handleClickAddToCart} disableElevation>
                  ADD TO CART
                </Button>
                <Button variant="outlined" disableElevation>
                  BUY
                </Button>
              </Fragment>
            )}
            {inventory_status === 'out_of_stock' && (
              <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
                The product is out of stock
                <br />
                Come back later, thanks for your attention!
              </Typography>
            )}
          </Stack>
          <IntendWrapper>
            {warranties?.length > 0 && (
              <Wrapper>
                {warranties.map((warranty, index) => {
                  const { k, v } = warranty;
                  return (
                    <Stack key={index} direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="caption">{k}</Typography>
                      <Typography variant="subtitle2">{v}</Typography>
                    </Stack>
                  );
                })}
              </Wrapper>
            )}
            <Wrapper
              sx={{
                width: STYLE.DESKTOP.PRODUCT.INTENDED_WIDTH,
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {DEFENSE_ICONS.map((defense, index) => {
                const { icon, title } = defense;
                const INTENDED_WIDTH = parseInt(STYLE.DESKTOP.PRODUCT.INTENDED_WIDTH);
                const WARRANTY_WIDTH = `${
                  (INTENDED_WIDTH - parseInt(WRAPPER_PADDING) * 2) / MAX_WARRANTY_IN_LINE
                }px`;
                return (
                  <Stack
                    key={index}
                    direction="column"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: WARRANTY_WIDTH }}
                  >
                    <Image
                      src={`${PATH_IMAGE.icons}/${icon}`}
                      alt=""
                      style={{
                        width: STYLE.DESKTOP.PRODUCT.WARRANTY_ICON_SIZE,
                        height: STYLE.DESKTOP.PRODUCT.WARRANTY_ICON_SIZE,
                      }}
                    />
                    <Typography sx={{ textAlign: 'center', fontSize: '13px' }}>{title}</Typography>
                  </Stack>
                );
              })}
            </Wrapper>
          </IntendWrapper>
        </Stack>
      </Stack>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  width: `calc(100% - ${STYLE.DESKTOP.PRODUCT.IMAGE_WIDTH})`,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const FlashSale = styled(Stack)({
  height: '35px',
  backgroundImage:
    'url(https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/4323ad4dc2b3c72d0474d51f20fb83e8.jpg)',
});

const PriceWrapper = styled('div')<PriceWrapperProps>(({ theme, tag }) => ({
  background: `${
    tag === 'sale'
      ? 'linear-gradient(100deg,rgb(255, 66, 78),rgb(253, 130, 10))'
      : theme.palette.background.default
  }`,
  borderRadius: '5px',
  padding: '15px',
  marginBottom: '10px',
  color: tag === 'sale' ? '#fff' : '',
}));

const DivideLine = styled('div')({
  width: '1px',
  height: '12px',
  backgroundColor: 'rgb(199, 199, 199)',
});

const IntendWrapper = styled('div')(({ theme }) => ({
  borderRadius: '10px',
  border: `1px solid ${theme.palette.background.default}`,
}));

const Wrapper = styled('div')(({ theme }) => ({
  padding: WRAPPER_PADDING,
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.background.default}`,
  },
}));

export default Information;

import { Fragment, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Button, Chip, Stack, Tooltip, Typography, styled } from '@mui/material';
import { Stars, QuantityInput } from '@/components';
import { appConfig } from '@/configs/apis';
import { STYLE } from '@/configs/constants';
import { IProduct } from '@/models/interfaces';
import { toVND } from '@/utils';
import { Image } from '../overrides';
import { useAppDispatch } from '@/redux/hooks';
import { addCart } from '@/redux/slices/cart.slice';

const WRAPPER_PADDING = '10px';
const MAX_WARRANTY_IN_LINE = 3;

interface PriceWrapperProps {
  tag: 'sale' | 'normal';
}

interface InformationProps
  extends Pick<
    IProduct.NestedProduct,
    | '_id'
    | 'name'
    | 'quantity'
    | 'limit'
    | 'discount_rate'
    | 'original_price'
    | 'price'
    | 'quantity_sold'
    | 'rating_average'
    | 'review_count'
    | 'inventory_status'
  > {}

const Information = (props: InformationProps) => {
  const {
    _id,
    name,
    quantity,
    limit,
    discount_rate,
    original_price,
    price,
    quantity_sold,
    rating_average,
    review_count,
    inventory_status,
  } = props;
  const [input, setInput] = useState('1');
  const dispatch = useAppDispatch();

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
                  -{discount_rate}%
                </Typography>
              )}
            </PriceWrapper>
            <Stack sx={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2">Delivery</Typography>
              <Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
                123, Ward 4, District 8, HCM City
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'rgb(26 139 237)' }}>
                Add new delivery address
              </Typography>
            </Stack>
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
                The product is out of stock or does not exist anymore.
                <br />
                Come back later, thanks for your attention!
              </Typography>
            )}
          </Stack>
          <IntendWrapper>
            <Wrapper>
              <Typography variant="caption">Tags:</Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
                {[...Array(5)].map((_, index) => {
                  return (
                    <Chip
                      key={index}
                      label="Toys"
                      variant="filled"
                      color="primary"
                      size="small"
                      sx={{ m: '3px' }}
                    />
                  );
                })}
              </Stack>
            </Wrapper>
            <Wrapper>
              {[...Array(3)].map((_, index) => {
                return (
                  <Stack direction="row" justifyContent="space-between" mb={1} key={index}>
                    <Typography variant="caption">Warranty period</Typography>
                    <Typography variant="subtitle2">12-month</Typography>
                  </Stack>
                );
              })}
            </Wrapper>
            <Wrapper
              sx={{
                width: STYLE.DESKTOP.PRODUCT.INTENDED_WIDTH,
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {[...Array(6)].map((_, index) => {
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
                      src={`${appConfig.image_storage_url}/_external_/icons/defense_check.png`}
                      alt=""
                      style={{
                        width: STYLE.DESKTOP.PRODUCT.WARRANTY_ICON_SIZE,
                        height: STYLE.DESKTOP.PRODUCT.WARRANTY_ICON_SIZE,
                      }}
                    />
                    <Typography sx={{ textAlign: 'center', fontSize: '13px' }}>
                      Hoàn tiền <br /> <strong>111%</strong> <br /> nếu hàng giả
                    </Typography>
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

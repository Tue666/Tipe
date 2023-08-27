import { Link as ScrollLink } from 'react-scroll';
import { Button, Chip, Stack, Tooltip, Typography, styled } from '@mui/material';
import Stars from '../Stars.component';
import QuantityInput from '../QuantityInput.component';
import { appConfig } from '@/configs/apis';
import { STYLE } from '@/configs/constants';

const WRAPPER_PADDING = '10px';
const MAX_WARRANTY_IN_LINE = 3;

const Information = () => {
  return (
    <Root>
      <Typography variant="h6">Thú nhồi bông</Typography>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Stars total={5} rating={5} sx={{ fontSize: '18px' }} />
          <ScrollLink
            to="review"
            duration={500}
            offset={parseInt(STYLE.DESKTOP.HEADER.HEIGHT.slice(0, -2)) * -1}
          >
            <Typography variant="subtitle1" sx={{ fontSize: '14px', cursor: 'pointer' }}>
              (View 999 reviews)
            </Typography>
          </ScrollLink>
          <DivideLine />
          <Tooltip placement="right" title="999 sold" arrow>
            <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
              999
            </Typography>
          </Tooltip>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} spacing={1}>
          <Stack spacing={1} sx={{ flex: '2 1 0%' }}>
            <PriceWrapper>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                10.000.000
              </Typography>
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
                  9.000.000
                </Typography>
                -10%
              </Typography>
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
            <Stack spacing={1}>
              <Typography variant="subtitle2">Quantity</Typography>
              <QuantityInput />
            </Stack>
            <Button variant="contained" color="error" disableElevation>
              BUY
            </Button>
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
                      color="error"
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
                    <img
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

const PriceWrapper = styled('div')(() => ({
  background: 'linear-gradient(100deg,rgb(255, 66, 78),rgb(253, 130, 10))',
  borderRadius: '5px',
  padding: '15px',
  marginBottom: '10px',
  color: '#fff',
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

import { Button, Divider, Stack, Typography, styled } from '@mui/material';
import { Link } from '../overrides';
import { STYLE } from '@/configs/constants';
import { productAvailable, toVND } from '@/utils';
import { StatisticsGroup, CartState } from '@/redux/slices/cart.slice';
import { useAppSelector } from '@/redux/hooks';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { PATH_CHECKOUT } from '@/configs/routers';

interface PriceStatisticsProps extends Pick<CartState, 'items' | 'statistics'> {}

const PriceStatistics = (props: PriceStatisticsProps) => {
  const { items, statistics } = props;
  const { addresses } = useAppSelector(selectCustomer);
  const selectedCount = items.filter((item) => {
    const { selected, product } = item;
    return selected && productAvailable(product.inventory_status, product.quantity);
  }).length;
  const totalPrice = (Object.keys(statistics) as Array<StatisticsGroup>).reduce(
    (sum, group) => sum + statistics[group].value * statistics[group].sign,
    0
  );
  const defaultAddress = addresses.find((address) => address.is_default);
  return (
    <Root>
      <ContentInner>
        {defaultAddress && (
          <Wrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Ship Address</Typography>
              <Linking href={PATH_CHECKOUT.shipping}>Change</Linking>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {defaultAddress.name} | {defaultAddress.phone_number}
            </Typography>
            <Typography variant="body2">{`${defaultAddress.street}, ${defaultAddress.ward.name}, ${defaultAddress.district.name}, ${defaultAddress.region.name}`}</Typography>
          </Wrapper>
        )}
        <Wrapper>
          <Typography variant="subtitle2">Tipe Promotion</Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', color: 'rgb(26 139 237)', cursor: 'pointer' }}
          >
            <i className="bi bi-ticket-detailed"></i> Select or enter another Promotion
          </Typography>
        </Wrapper>
        <Wrapper>
          {(Object.keys(statistics) as Array<StatisticsGroup>).map((group, index) => {
            const { value, sign } = statistics[group];
            return (
              <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                  {group}
                </Typography>
                <Typography variant="subtitle1">{toVND(value * sign)}</Typography>
              </Stack>
            );
          })}
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Total</Typography>
            <Stack alignItems="end">
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                {selectedCount > 0 ? toVND(totalPrice) : 'Choose a product, please!'}
              </Typography>
              <Typography variant="caption">(VAT includes)</Typography>
            </Stack>
          </Stack>
        </Wrapper>
        {selectedCount > 0 && (
          <Button variant="contained" disableElevation sx={{ width: '100%' }}>
            Check out ({selectedCount})
          </Button>
        )}
      </ContentInner>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  width: `calc(100% - calc(${STYLE.DESKTOP.CART.LIST_WIDTH} + 7px))`,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ContentInner = styled('div')(() => ({
  position: 'sticky',
  top: `calc(${STYLE.DESKTOP.HEADER.HEIGHT} + 10px)`,
}));

const Wrapper = styled('div')(({ theme }) => ({
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: theme.palette.background.paper,
  fontSize: '14px',
}));

const Linking = styled(Link)({
  color: 'rgb(26 139 237)',
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: '500',
});

export default PriceStatistics;

import _ from 'lodash';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
  styled,
  Grid,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableFooter as MTableFooter,
} from '@mui/material';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { PageWithLayout } from '@/pages/_app';
import { Hidden, Page } from '@/components';
import { Image, Link } from '@/components/overrides';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import orderApi from '@/apis/orderApi';
import { IOrder } from '@/models/interfaces';
import { ORDER_TABS } from '.';
import { buildImageLink, toVND } from '@/utils';
import { PATH_CUSTOMER, PATH_MAIN } from '@/configs/routers';
import { STYLE } from '@/configs/constants';
import OrderTracking from '@/components/customer/order/OrderTracking.component';

interface OrderProps {
  order: IOrder.Order;
}

const Order: PageWithLayout<OrderProps> = (props: OrderProps) => {
  const { order } = props;
  const { push } = useRouter();
  const {
    _id,
    shipping_address,
    payment_method,
    items,
    price_summary,
    tracking_info,
    note,
    created_at,
  } = order;
  const { name, phone_number, company, region, district, ward, street } = shipping_address;
  const { method_text, message, description } = payment_method;
  const { status, status_text, tracking_list } = tracking_info;
  const { color } = ORDER_TABS[status];
  const totalPrice = price_summary.reduce((sum, price) => sum + price.value, 0);

  const handleNavigateOrders = () => {
    push(PATH_CUSTOMER.orders);
  };
  return (
    <Page title="My Order | Tipe">
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={1}>
          <Typography variant="body1">
            Order details #<strong>{_id}</strong>
          </Typography>
          <span>-</span>
          <Typography variant="body1" color={color} sx={{ fontWeight: 'bold' }}>
            {status_text}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={handleNavigateOrders} />
          <Typography variant="caption" sx={{ fontWeight: 'bold', alignSelf: 'end' }}>
            Created at: {created_at}
          </Typography>
        </Stack>
        {tracking_list?.length > 0 && (
          <Stack spacing={1} sx={{ height: '100%' }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
              order tracking
            </Typography>
            <Wrapper
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'center', md: 'end' }}
            >
              <OrderTracking tracking_list={tracking_list} />
              <Stack spacing={1} p={2}>
                <Button variant="outlined">GET IN TOUCH WITH SELLER</Button>
                <Button variant="outlined">REQUEST AN ELECTRONIC INVOICE</Button>
              </Stack>
            </Wrapper>
          </Stack>
        )}
        <Grid
          container
          spacing={2}
          columns={note ? 18 : 12}
          sx={{ position: 'relative', right: (theme) => theme.spacing(2) }}
        >
          <Grid item md={6} sm={6} xs={12}>
            <Stack spacing={1} sx={{ height: '100%' }}>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
                shipping address
              </Typography>
              <Wrapper>
                {company && (
                  <Typography
                    variant="body1"
                    sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                  >
                    Company: {company}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {name}
                </Typography>
                <Typography variant="caption">
                  Address: {`${street}, ${ward}, ${district}, ${region}`}
                </Typography>
                <Typography variant="caption">{phone_number}</Typography>
              </Wrapper>
            </Stack>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Stack spacing={1} sx={{ height: '100%' }}>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
                payment method
              </Typography>
              <Wrapper>
                <Typography variant="caption">{method_text}</Typography>
                {message && (
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Status: {message}
                  </Typography>
                )}
                {description && (
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Description: {description}
                  </Typography>
                )}
              </Wrapper>
            </Stack>
          </Grid>
          {note && (
            <Grid item md={6} sm={6} xs={12}>
              <Stack spacing={1} sx={{ height: '100%' }}>
                <Typography
                  variant="subtitle2"
                  color="error.main"
                  sx={{ textTransform: 'uppercase' }}
                >
                  note
                </Typography>
                <Wrapper>
                  <Typography variant="caption">{note}</Typography>
                </Wrapper>
              </Stack>
            </Grid>
          )}
        </Grid>
        <Wrapper>
          <Hidden breakpoint="md" type="Down">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Products</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell align="right">Guess</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const { _id, name, images, original_price, price, quantity, slug } = item;
                  const productHref = PATH_MAIN.product(slug, _id);
                  return (
                    <TableRow key={_id}>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Link href={productHref}>
                            <Image
                              alt={name}
                              src={buildImageLink(images[0])}
                              sx={{
                                width: STYLE.DESKTOP.CUSTOMER.ORDERS.ITEM_IMAGE_SIZE,
                                height: STYLE.DESKTOP.CUSTOMER.ORDERS.ITEM_IMAGE_SIZE,
                                border: '0.5px solid rgb(238, 238, 238)',
                                flexShrink: 0,
                                padding: '5px',
                              }}
                            />
                          </Link>
                          <Stack>
                            <Link href={productHref}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {name}
                              </Typography>
                            </Link>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {status === 'delivered' && (
                                <Button variant="outlined" color="secondary" size="small">
                                  WRITE A REVIEW
                                </Button>
                              )}
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => {}}
                              >
                                REPURCHASE
                              </Button>
                            </Stack>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>{toVND(original_price)}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{toVND((original_price - price) * quantity)}</TableCell>
                      <TableCell align="right">{toVND(price * quantity)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                {price_summary.map((price, index) => {
                  const { name, value } = price;
                  return (
                    <tr key={index}>
                      <td colSpan={4}>
                        <Typography variant="subtitle2">{name}</Typography>
                      </td>
                      <td>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {toVND(value)}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={4}>
                    <Typography variant="subtitle2">Total</Typography>
                  </td>
                  <td>
                    <Typography color="error.main" sx={{ fontWeight: 'bold' }}>
                      {toVND(totalPrice)}
                    </Typography>
                  </td>
                </tr>
              </TableFooter>
            </Table>
          </Hidden>
          <Hidden breakpoint="md" type="Up">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Products</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const { _id, name, images, original_price, price, quantity, slug } = item;
                  const productHref = PATH_MAIN.product(slug, _id);
                  return (
                    <TableRow key={_id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Link href={productHref}>
                            <Image
                              alt={name}
                              src={buildImageLink(images[0])}
                              sx={{
                                width: STYLE.MOBILE.CUSTOMER.ORDERS.ITEM_IMAGE_SIZE,
                                height: STYLE.MOBILE.CUSTOMER.ORDERS.ITEM_IMAGE_SIZE,
                                border: '0.5px solid rgb(238, 238, 238)',
                                flexShrink: 0,
                                padding: '5px',
                              }}
                            />
                          </Link>
                          <Stack spacing={1}>
                            <Link href={productHref}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {name}
                              </Typography>
                            </Link>
                            <Stack>
                              <Typography variant="caption">
                                {toVND(original_price)} x{quantity} (-
                                {toVND((original_price - price) * quantity)})
                              </Typography>
                              <Typography variant="subtitle2">
                                Guess: {toVND(price * quantity)}
                              </Typography>
                            </Stack>
                            <Stack spacing={1}>
                              {status === 'delivered' && (
                                <Button variant="outlined" color="secondary" size="small">
                                  WRITE A REVIEW
                                </Button>
                              )}
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => {}}
                              >
                                REPURCHASE
                              </Button>
                            </Stack>
                          </Stack>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {price_summary.map((price, index) => {
                  const { name, value } = price;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                            {name}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {toVND(value)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                        Total
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="error.main"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {toVND(totalPrice)}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Hidden>
        </Wrapper>
      </Stack>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { params } = context;
    if (!params?.orderId) {
      console.log('Order generated with error: params not found');
      return {
        notFound: true,
      };
    }

    const _id = params.orderId as string;
    const order = await orderApi.findById(_id);
    if (_.isNil(order) || _.isEmpty(order)) {
      console.log('Order generated with error: resources not found');
      return {
        notFound: true,
      };
    }

    return {
      props: {
        order,
      },
    };
  } catch (error) {
    console.log('Order generated with error:', error);
    return {
      notFound: true,
    };
  }
};

const Wrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
  padding: theme.spacing(1),
  flex: 1,
}));

const TableFooter = styled(MTableFooter)({
  '& tr:first-of-type td': {
    paddingTop: '30px',
  },
  '& tr:last-of-type td': {
    paddingBottom: '30px',
  },
  '& td': {
    textAlign: 'right',
    padding: '5px 30px',
  },
});

Order.getLayout = (page) => {
  return (
    <MainLayout hasGuard={true}>
      <CustomerLayout>{page}</CustomerLayout>
    </MainLayout>
  );
};

export default Order;

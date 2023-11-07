import _ from 'lodash';
import { useEffect, useState } from 'react';
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
  Skeleton,
  Alert,
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
import { enqueueNotify } from '@/hooks/useSnackbar';
import { useConfirm } from 'material-ui-confirm';

const Order: PageWithLayout = () => {
  const [order, setOrder] = useState<IOrder.Order | null>(null);
  const { query, isReady, push } = useRouter();
  const confirm = useConfirm();

  useEffect(() => {
    const findOrderById = async () => {
      const { orderId: _id } = query;
      if (_.isNil(_id) || _id === '') {
        enqueueNotify('Order generated with error: params not found', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        return;
      }

      const order = await orderApi.findById(_id as string);
      if (_.isNil(order) || _.isEmpty(order)) {
        enqueueNotify('Order generated with error: resource not found', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        return;
      }

      setOrder(order);
    };

    isReady && findOrderById();
  }, [query, isReady]);

  const handleNavigateOrders = () => {
    push(PATH_CUSTOMER.orders);
  };
  const handleClickGetInTouchSeller = async () => {
    try {
      await confirm({
        title: 'Notification',
        content: (
          <Alert severity="error">This service is under maintenance, please come back later</Alert>
        ),
        confirmationButtonProps: {
          color: 'error',
        },
        hideCancelButton: true,
      });
    } catch (error) {
      if (error === undefined) return;
      console.log('Confirm error:', error);
    }
  };
  const handleClickRequestElectronicInvoice = async () => {
    try {
      await confirm({
        title: 'Notification',
        content: (
          <Alert severity="error">This service is under maintenance, please come back later</Alert>
        ),
        confirmationButtonProps: {
          color: 'error',
        },
        hideCancelButton: true,
      });
    } catch (error) {
      if (error === undefined) return;
      console.log('Confirm error:', error);
    }
  };
  return (
    <Page title="My Order | Tipe">
      {!_.isNil(order) &&
        (() => {
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
          return (
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
                    <OrderTracking tracking_info={tracking_info} />
                    <Stack spacing={1} p={2}>
                      <Button variant="outlined" onClick={handleClickGetInTouchSeller}>
                        GET IN TOUCH WITH SELLER
                      </Button>
                      <Button variant="outlined" onClick={handleClickRequestElectronicInvoice}>
                        REQUEST AN ELECTRONIC INVOICE
                      </Button>
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
                      <Typography
                        variant="body1"
                        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                      >
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
                                <Typography
                                  variant="subtitle2"
                                  sx={{ textTransform: 'capitalize' }}
                                >
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
          );
        })()}
      {_.isNil(order) && (
        <Stack spacing={2}>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="15%" />
          <Grid
            container
            spacing={2}
            sx={{ position: 'relative', right: (theme) => theme.spacing(2) }}
          >
            {[...Array(2)].map((_, index) => (
              <Grid key={index} item md={6} sm={6} xs={12}>
                <Stack spacing={1} sx={{ height: '100%' }}>
                  <Skeleton variant="text" />
                  <Skeleton variant="rectangular" height="140px" />
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Stack spacing={1}>
            {[...Array(2)].map((_, index) => (
              <Stack key={index} direction="row" alignItems="center" spacing={1}>
                <Skeleton variant="rectangular" width="80px" height="80px" />
                <Stack sx={{ flex: 1 }}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Page>
  );
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

import { Button, Divider, Stack, Typography } from '@mui/material';
import { Image } from '../../overrides';
import { IOrder } from '@/models/interfaces';
import { buildImageLink, toVND } from '@/utils';
import { OrderTabs } from '@/pages/customer/orders';
import { STYLE } from '@/configs/constants';
import { useRouter } from 'next/router';
import { PATH_CUSTOMER, PATH_IMAGE } from '@/configs/routers';

interface OrderPanelProps {
  tabs: OrderTabs;
  orders: IOrder.Order[];
}

const OrderPanel = (props: OrderPanelProps) => {
  const { tabs, orders } = props;
  const { push } = useRouter();

  const handleNavigateOrder = (_id: IOrder.Order['_id']) => {
    push(PATH_CUSTOMER.order(_id));
  };
  return (
    <Stack spacing={1}>
      {orders?.length > 0 &&
        orders.map((order) => {
          const { _id, items, price_summary, tracking_info } = order;
          const { status, status_text, time } = tracking_info;
          const { color, icon } = tabs[status];
          const totalPrice = price_summary.reduce((sum, price) => sum + price.value, 0);
          return (
            <Stack
              key={_id}
              p={2}
              spacing={1}
              sx={{ bgcolor: (theme) => theme.palette.background.paper }}
            >
              <Typography
                color={color}
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {icon}&nbsp;{status_text} - #{_id} ({time})
              </Typography>
              <Divider />
              <Stack>
                {items.map((item) => {
                  const { _id, name, quantity, price, images } = item;
                  return (
                    <Stack
                      key={_id}
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                      p={1}
                      onClick={() => handleNavigateOrder(order._id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Stack direction="row" spacing={2}>
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
                        <Stack>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {name}
                          </Typography>
                          <Typography variant="caption">Single: {toVND(price)}</Typography>
                          <Typography variant="caption">Quantity: {quantity}</Typography>
                        </Stack>
                      </Stack>
                      <Stack alignItems="end" sx={{ width: '100px' }}>
                        <Typography variant="subtitle2">{toVND(quantity * price)}</Typography>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
              <Divider />
              <Stack alignItems="end" spacing={1}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Total price: {toVND(totalPrice)}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {status === 'awaiting_payment' && (
                    <Button variant="outlined" color="success" size="small" onClick={() => {}}>
                      CONTINUE PAYING
                    </Button>
                  )}
                  {status === 'processing' && (
                    <Button variant="outlined" color="error" size="small" onClick={() => {}}>
                      CANCEL
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleNavigateOrder(_id)}
                  >
                    DETAILS
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      {orders?.length <= 0 && (
        <Stack
          p={10}
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        >
          <Image
            alt="empty-order"
            src={`${PATH_IMAGE.root}empty-order.png`}
            sx={{
              width: STYLE.DESKTOP.CUSTOMER.ORDERS.EMPTY_ORDER_IMAGE_SIZE,
              height: STYLE.DESKTOP.CUSTOMER.ORDERS.EMPTY_ORDER_IMAGE_SIZE,
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            No orders yet
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default OrderPanel;

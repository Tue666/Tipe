import { ReactNode } from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { Image } from '../overrides';
import { IOrder } from '@/models/interfaces';
import { appConfig } from '@/configs/apis';
import { toVND } from '@/utils';

interface OrderPanelProps {
  orders: IOrder.Order[];
  color: string;
  icon: ReactNode;
}

const OrderPanel = (props: OrderPanelProps) => {
  const { orders, color, icon } = props;
  return (
    <Stack spacing={1}>
      {orders?.length > 0 &&
        orders.map((order) => {
          const { _id, items, price_summary, tracking_info } = order;
          const { status_text, time } = tracking_info;
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
                      onClick={() => {}}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Image
                          alt=""
                          src={`${appConfig.image_storage_url}/${images[0]}`}
                          sx={{
                            width: '80px',
                            height: '80px',
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
                  <Button variant="outlined" color="success" size="small" onClick={() => {}}>
                    CONTINUE PAYING
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => {}}>
                    CANCEL
                  </Button>
                  <Button variant="outlined" color="secondary" size="small" onClick={() => {}}>
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
            src={`${appConfig.image_storage_url}/empty-order.png`}
            sx={{
              width: '200px',
              height: '200px',
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

import { Button, Divider, Stack, Typography } from '@mui/material';
import { Image } from '../overrides';

const OrderPanel = () => {
  return (
    <Stack spacing={1}>
      <Stack p={2} spacing={1} sx={{ bgcolor: (theme) => theme.palette.background.paper }}>
        <Typography
          //   color={color}
          variant="subtitle2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          status_text
          {/* {icon}&nbsp;{status_text} - #{_id} ({fDate(time)}) */}
        </Typography>
        <Divider />
        <Stack>
          {[...Array(5)].map((_, index) => {
            return (
              <Stack
                key={index}
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
                    src="/product-card-2.jpg"
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
                      name
                    </Typography>
                    <Typography variant="caption">Single: price</Typography>
                    <Typography variant="caption">Quantity: quantity</Typography>
                  </Stack>
                </Stack>
                <Stack alignItems="end" sx={{ width: '100px' }}>
                  <Typography variant="subtitle2">total</Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
        <Divider />
        <Stack alignItems="end" spacing={1}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Total price: price
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
    </Stack>
  );
};

export default OrderPanel;

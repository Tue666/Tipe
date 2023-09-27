import { Button, Stack, Typography, styled } from '@mui/material';

const DeliveryAddress = () => {
  return (
    <Address>
      <Stack sx={{ width: '100%' }}>
        <div>
          <Typography component="span" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            name
          </Typography>
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Typography component="span" variant="caption">
            Address:&nbsp;
          </Typography>
          <Typography component="span" variant="subtitle2">
            delivery_address
          </Typography>
        </div>
        <div>
          <Typography component="span" variant="caption">
            Phone number:&nbsp;
          </Typography>
          <Typography component="span" variant="subtitle2">
            phone_number
          </Typography>
        </div>
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disableElevation
            onClick={() => {}}
          >
            Delivery to this address
          </Button>
          <Button
            variant="outlined"
            color="success"
            size="small"
            disableElevation
            onClick={() => {}}
          >
            Edit
          </Button>
          <Button variant="outlined" color="error" size="small" disableElevation onClick={() => {}}>
            Remove
          </Button>
        </Stack>
      </Stack>
      <Default variant="caption" color="success.main">
        <i className="bi bi-check-circle"></i> Default address
      </Default>
    </Address>
  );
};

const Address = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '5px',
  display: 'flex',
  justifyContent: 'space-between',
  border: true ? `1px dashed ${theme.palette.success.main}` : `1px solid rgb(221, 221, 221)`,
  position: 'relative',
}));

const Default = styled(Typography)({
  position: 'absolute',
  top: '10px',
  right: '15px',
  fontWeight: 'bold',
});

export default DeliveryAddress;

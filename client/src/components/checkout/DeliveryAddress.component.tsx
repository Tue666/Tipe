import { IAccount } from '@/models/interfaces';
import { Button, Stack, Typography, styled } from '@mui/material';

interface AddressProps {
  is_default: boolean;
}

interface DeliveryAddressProps {
  address: IAccount.Address;
  handleNavigateAddress: (_id: IAccount.Address['_id']) => void;
  handleSwitchAddress: (_id: IAccount.Address['_id']) => void;
  handleRemoveAddress: (_id: IAccount.Address['_id']) => Promise<void>;
}

const DeliveryAddress = (props: DeliveryAddressProps) => {
  const { address, handleNavigateAddress, handleSwitchAddress, handleRemoveAddress } = props;
  const { _id, name, phone_number, ward, district, region, street, is_default } = address;
  const delivery_address = `${street}, ${ward.name}, ${district.name}, ${region.name}`;
  return (
    <Address is_default={is_default}>
      <Stack sx={{ width: '100%' }}>
        <div>
          <Typography component="span" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            {name}
          </Typography>
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Typography component="span" variant="caption">
            Address:&nbsp;
          </Typography>
          <Typography component="span" variant="subtitle2">
            {delivery_address}
          </Typography>
        </div>
        <div>
          <Typography component="span" variant="caption">
            Phone number:&nbsp;
          </Typography>
          <Typography component="span" variant="subtitle2">
            {phone_number}
          </Typography>
        </div>
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disableElevation
            onClick={() => handleSwitchAddress(_id)}
          >
            Delivery to this address
          </Button>
          <Button
            variant="outlined"
            color="success"
            size="small"
            disableElevation
            onClick={() => handleNavigateAddress(_id)}
          >
            Edit
          </Button>
          {!is_default && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              disableElevation
              onClick={() => handleRemoveAddress(_id)}
            >
              Remove
            </Button>
          )}
        </Stack>
      </Stack>
      {is_default && (
        <Default variant="caption" color="success.main">
          <i className="bi bi-check-circle"></i> Default address
        </Default>
      )}
    </Address>
  );
};

const Address = styled('div')<AddressProps>(({ theme, is_default }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '5px',
  display: 'flex',
  justifyContent: 'space-between',
  border: is_default ? `1px dashed ${theme.palette.success.main}` : `1px solid rgb(221, 221, 221)`,
  position: 'relative',
}));

const Default = styled(Typography)({
  position: 'absolute',
  top: '10px',
  right: '15px',
  fontWeight: 'bold',
});

export default DeliveryAddress;

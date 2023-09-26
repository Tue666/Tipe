import { Alert, Stack, Typography, styled } from '@mui/material';
import { AddLocationAltOutlined } from '@mui/icons-material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import { Link } from '@/components/overrides';
import { PATH_CUSTOMER } from '@/configs/routers';
import { useAppSelector } from '@/redux/hooks';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { useConfirm } from 'material-ui-confirm';

const Addresses: PageWithLayout = () => {
  const { addresses } = useAppSelector(selectCustomer);
  const confirm = useConfirm();

  const handleRemoveAddress = async (_id: string) => {
    try {
      await confirm({
        title: 'Remove address',
        content: <Alert severity="error">Do you want to remove the selected address?</Alert>,
        confirmationButtonProps: {
          color: 'error',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Page title="Addresses book | Tipe">
      <Add href={PATH_CUSTOMER.createAddress}>
        <AddLocationAltOutlined />
        Add new address
      </Add>
      <Stack spacing={1}>
        {addresses?.length > 0 &&
          addresses.map((address) => {
            const { _id, name, region, district, ward, street, phone_number, is_default } = address;
            const delivery_address = `${street}, ${ward.name}, ${district.name}, ${region.name}`;
            return (
              <Address key={_id} direction="row" spacing={1}>
                <div>
                  <div>
                    <Typography
                      component="span"
                      sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                    >
                      {name}
                    </Typography>
                    {is_default && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="success.main"
                        ml={2}
                        sx={{ fontWeight: 'bold' }}
                      >
                        <i className="bi bi-check-circle"></i> Default address
                      </Typography>
                    )}
                  </div>
                  <div>
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
                </div>
                <div>
                  <Link
                    href={`${PATH_CUSTOMER.editAddress(_id)}`}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      color: 'success.main',
                    }}
                  >
                    Edit
                  </Link>
                  {!is_default && (
                    <Typography
                      component="span"
                      variant="subtitle2"
                      color="error.main"
                      ml={2}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveAddress(_id)}
                    >
                      Remove
                    </Typography>
                  )}
                </div>
              </Address>
            );
          })}
      </Stack>
    </Page>
  );
};

const Add = styled(Link)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.success.main}`,
  height: '60px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  fontSize: '14px',
  textDecoration: 'none',
  fontWeight: 'bold',
}));

const Address = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '5px',
  display: 'flex',
  justifyContent: 'space-between',
}));

Addresses.getLayout = (page) => {
  return (
    <MainLayout>
      <CustomerLayout>{page}</CustomerLayout>
    </MainLayout>
  );
};

export default Addresses;

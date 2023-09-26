import { Stack, Typography, styled } from '@mui/material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import { Link } from '@/components/overrides';
import { PATH_CUSTOMER } from '@/configs/routers';

const Addresses: PageWithLayout = () => {
  return (
    <Page title="Addresses book | Tipe">
      <Stack spacing={1}>
        {[...Array(5)].map((_, index) => {
          return (
            <Address key={index}>
              <div>
                <div>
                  <Typography
                    component="span"
                    sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                  >
                    name
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="success.main"
                    ml={2}
                    sx={{ fontWeight: 'bold' }}
                  >
                    <i className="bi bi-check-circle"></i> Default address
                  </Typography>
                </div>
                <div>
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
              </div>
              <div>
                <Link
                  href={`${PATH_CUSTOMER.editAddress('1')}`}
                  sx={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: 'success.main',
                  }}
                >
                  Edit
                </Link>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="error.main"
                  ml={2}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {}}
                >
                  Remove
                </Typography>
              </div>
            </Address>
          );
        })}
      </Stack>
    </Page>
  );
};

const Address = styled('div')(({ theme }) => ({
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

import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { AccountBox, ImportContacts, LocalMall } from '@mui/icons-material';
import { Avatar, Container } from '@/components/overrides';
import { Breadcrumbs, Hidden } from '@/components';
import Navbars from './Navbars';

const MENUS = [
  {
    title: 'Customer information',
    icon: <AccountBox />,
    href: '#',
  },
  {
    title: 'Order management',
    icon: <LocalMall />,
    href: '#',
  },
  {
    title: 'Addresses book',
    icon: <ImportContacts />,
    href: '#',
  },
];

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout = (props: CustomerLayoutProps) => {
  const { children } = props;
  return (
    <Container>
      <Breadcrumbs current="Menu" />
      <Stack direction="row" spacing={2}>
        <Hidden breakpoint="md" type="Down">
          <Stack sx={{ width: '250px' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                name="Tuệ (Customer)"
                src="/product-card-2.jpg"
                sx={{ width: '65px', height: '65px' }}
              />
              <Stack>
                <Typography variant="caption">Account of</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Tuệ (Customer)
                </Typography>
              </Stack>
            </Stack>
            <Navbars menus={MENUS} />
          </Stack>
        </Hidden>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography variant="h6">Menu</Typography>
          {children}
        </Stack>
      </Stack>
    </Container>
  );
};

export default CustomerLayout;

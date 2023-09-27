import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { AccountBox, ImportContacts, LocalMall } from '@mui/icons-material';
import { Avatar, Container } from '@/components/overrides';
import { Breadcrumbs, Hidden } from '@/components';
import Navbars from './Navbars';
import { PATH_CUSTOMER } from '@/configs/routers';
import { STYLE } from '@/configs/constants';

const MENUS = [
  {
    title: 'Customer information',
    icon: <AccountBox />,
    href: PATH_CUSTOMER.profile,
  },
  {
    title: 'Order management',
    icon: <LocalMall />,
    href: PATH_CUSTOMER.orders,
  },
  {
    title: 'Addresses book',
    icon: <ImportContacts />,
    href: PATH_CUSTOMER.addresses,
  },
];

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout = (props: CustomerLayoutProps) => {
  const { children } = props;
  const { pathname } = useRouter();
  const currentMenu = MENUS.filter((menu) => pathname.indexOf(menu.href) !== -1)[0];
  return (
    <Container>
      <Breadcrumbs current={currentMenu.title} />
      <Stack direction="row" spacing={2}>
        <Hidden breakpoint="md" type="Down">
          <Stack sx={{ width: '250px' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                name="Tuệ (Customer)"
                src="/product-card-2.jpg"
                sx={{
                  width: STYLE.DESKTOP.CUSTOMER.NAVBARS.AVATAR_SIZE,
                  height: STYLE.DESKTOP.CUSTOMER.NAVBARS.AVATAR_SIZE,
                }}
              />
              <Stack>
                <Typography variant="caption">Account of</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Tuệ (Customer)
                </Typography>
              </Stack>
            </Stack>
            <Navbars menus={MENUS} currentHref={currentMenu.href} />
          </Stack>
        </Hidden>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Typography variant="h6">{currentMenu.title}</Typography>
          {children}
        </Stack>
      </Stack>
    </Container>
  );
};

export default CustomerLayout;

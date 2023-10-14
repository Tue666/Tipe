import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { AccountBox, ImportContacts, LocalMall } from '@mui/icons-material';
import { Avatar, Container } from '@/components/overrides';
import { Breadcrumbs, Ellipsis, Hidden } from '@/components';
import Navbars from './Navbars';
import { PATH_CUSTOMER } from '@/configs/routers';
import { STYLE } from '@/configs/constants';
import { AuthGuard } from '@/guards';
import { useAppSelector } from '@/redux/hooks';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { buildImageLink } from '@/utils';

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
  hasGuard?: boolean;
}

const CustomerLayout = (props: CustomerLayoutProps) => {
  const { children, hasGuard = false } = props;
  const { pathname } = useRouter();
  const { profile } = useAppSelector(selectCustomer);
  const { name, avatar_url } = profile;
  const currentMenu = MENUS.filter((menu) => pathname.indexOf(menu.href) !== -1)[0];
  const renderLayout = () => {
    return (
      <Container>
        <Breadcrumbs current={currentMenu.title} />
        <Stack direction="row" spacing={2}>
          <Hidden breakpoint="md" type="Down">
            <Stack sx={{ width: '250px' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  name={name}
                  src={buildImageLink(avatar_url)}
                  sx={{
                    width: STYLE.DESKTOP.CUSTOMER.NAVBARS.AVATAR_SIZE,
                    height: STYLE.DESKTOP.CUSTOMER.NAVBARS.AVATAR_SIZE,
                  }}
                />
                <Stack>
                  <Typography variant="caption">Account of</Typography>
                  <Ellipsis variant="body1" text={name} sx={{ fontWeight: 'bold' }} />
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

  if (hasGuard) {
    return <AuthGuard>{renderLayout()}</AuthGuard>;
  }

  return renderLayout();
};

export default CustomerLayout;

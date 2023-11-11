import { MouseEvent } from 'react';
import { Stack, SxProps } from '@mui/material';
import { AuthContextState, AuthContextStateMethod } from '@/contexts/Auth.context';
import { Link } from '@/components/overrides';
import { CustomerState } from '@/redux/slices/customer.slice';
import { AccountOption, Menu } from './Navbars';
import AccountPopover from './AccountPopover';

interface MenuDesktopProps {
  auth: AuthContextState & AuthContextStateMethod;
  profile: CustomerState['profile'];
  connects: Menu[];
  apps: Menu[];
  accountOptions: AccountOption[];
  menuItemStyle: SxProps;
  handleClickSignIO: (e: MouseEvent) => void;
  handleClickSignOut: (signOut: () => void) => void;
}

const MenuDesktop = (props: MenuDesktopProps) => {
  const {
    auth,
    profile,
    connects,
    apps,
    accountOptions,
    menuItemStyle,
    handleClickSignIO,
    handleClickSignOut,
  } = props;
  const { isInitialized, isAuthenticated, signOut } = auth;

  const handleDesktopSignOut = () => {
    handleClickSignOut(signOut);
  };
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" justifyContent="space-between">
        {connects &&
          connects.map((connect, index) => {
            const { icon, title, href, target } = connect;
            return (
              <Link key={index} href={href} target={target} sx={menuItemStyle}>
                {icon} {title}
              </Link>
            );
          })}
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        {apps &&
          apps.map((app, index) => {
            const { icon, title, href, target } = app;
            return (
              <Link key={index} href={href} target={target} sx={menuItemStyle}>
                {icon} {title}
              </Link>
            );
          })}
        {isInitialized && isAuthenticated && (
          <AccountPopover
            profile={profile}
            accountOptions={accountOptions}
            signOut={handleDesktopSignOut}
          />
        )}
        {isInitialized && !isAuthenticated && (
          <Link href="#" sx={menuItemStyle} onClick={handleClickSignIO}>
            Sign in / Sign up
          </Link>
        )}
      </Stack>
    </Stack>
  );
};

export default MenuDesktop;

import { Fragment, MouseEvent, useState } from 'react';
import {
  Button,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { AuthContextState, AuthContextStateMethod } from '@/contexts/Auth.context';
import { Avatar, Link } from '@/components/overrides';
import { CustomerState } from '@/redux/slices/customer.slice';
import { STYLE } from '@/configs/constants';
import { PATH_IMAGE } from '@/configs/routers';
import { AccountOption, Menu } from './Navbars';
import { buildImageLink } from '@/utils';

interface MenuMobileProps {
  auth: AuthContextState & AuthContextStateMethod;
  profile: CustomerState['profile'];
  apps: Menu[];
  accountOptions: AccountOption[];
  menuItemStyle: SxProps;
  handleClickSignIO: (e: MouseEvent) => void;
  handleClickSignOut: (signOut: () => void) => void;
}

const MenuMobile = (props: MenuMobileProps) => {
  const {
    auth,
    profile,
    apps,
    accountOptions,
    menuItemStyle,
    handleClickSignIO,
    handleClickSignOut,
  } = props;
  const [isOpenMenuDrawer, setIsOpenMenuDrawer] = useState(false);
  const [isOpenAccountOptions, setIsOpenAccountOptions] = useState(true);
  const { isInitialized, isAuthenticated, signOut } = auth;
  const { name, avatar_url } = profile;

  const handleMobileSignOut = () => {
    handleClickSignOut(() => {
      setIsOpenMenuDrawer(false);
      signOut();
    });
  };
  return (
    <Fragment>
      <Typography sx={menuItemStyle} onClick={() => setIsOpenMenuDrawer(true)}>
        <i className="bi bi-list"></i>
      </Typography>
      <Drawer anchor="left" open={isOpenMenuDrawer} onClose={() => setIsOpenMenuDrawer(false)}>
        <Stack
          alignItems="center"
          spacing={2}
          py={3}
          sx={{ width: STYLE.MOBILE.ACCOUNT_POPOVER.WIDTH }}
        >
          {isInitialized && isAuthenticated && (
            <Stack alignItems="center" spacing={2}>
              <Avatar
                name={name ?? 'avatar'}
                src={avatar_url ? buildImageLink(avatar_url) : `${PATH_IMAGE.root}avatar.png`}
                sx={{
                  width: STYLE.MOBILE.ACCOUNT_POPOVER.AVATAR_SIZE,
                  height: STYLE.MOBILE.ACCOUNT_POPOVER.AVATAR_SIZE,
                }}
              />
              <Button variant="outlined" size="small" onClick={handleMobileSignOut}>
                Sign Out
              </Button>
            </Stack>
          )}
          {isInitialized && !isAuthenticated && (
            <Button variant="outlined" size="small" onClick={handleClickSignIO}>
              Sign in / Sign up
            </Button>
          )}
          <Divider sx={{ width: '100%' }} />
          <List dense sx={{ width: '100%' }}>
            {isInitialized && isAuthenticated && (
              <Fragment>
                <ListItemButton onClick={() => setIsOpenAccountOptions(!isOpenAccountOptions)}>
                  <ListItemIcon>
                    <i className="bi bi-person"></i>
                  </ListItemIcon>
                  <ListItemText primary={name ?? 'Tipe User'} />
                  {isOpenAccountOptions ? (
                    <i className="bi bi-caret-up" />
                  ) : (
                    <i className="bi bi-caret-down" />
                  )}
                </ListItemButton>
                <Collapse in={isOpenAccountOptions} timeout="auto" unmountOnExit>
                  <List dense disablePadding>
                    {accountOptions.map((option) => {
                      const { label, icon, href } = option;
                      return (
                        <Link key={label} href={href}>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label} />
                          </ListItemButton>
                        </Link>
                      );
                    })}
                  </List>
                </Collapse>
              </Fragment>
            )}
            {apps &&
              apps.map((app, index) => {
                const { icon, title, href, target } = app;
                return (
                  <Link key={index} href={href} target={target}>
                    <ListItemButton>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItemButton>
                  </Link>
                );
              })}
          </List>
        </Stack>
      </Drawer>
    </Fragment>
  );
};

export default MenuMobile;

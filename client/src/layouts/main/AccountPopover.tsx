import { useState, MouseEvent, Fragment } from 'react';
import { styled, Popover, Stack, Divider, MenuList, MenuItem, ListItemIcon } from '@mui/material';
import { AssignmentIndOutlined, LogoutOutlined } from '@mui/icons-material';
import { Link, Avatar } from '@/components/overrides';
import { PATH_CUSTOMER } from '@/configs/routers';
import { STYLE } from '@/configs/constants';

const MENU_OPTIONS = [
  {
    label: 'My Profile',
    icon: <AssignmentIndOutlined />,
    href: PATH_CUSTOMER.profile,
  },
];

interface AccountPopoverProps {
  signOut: () => void;
}

const AccountPopover = (props: AccountPopoverProps) => {
  const { signOut } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Label onClick={handleClick}>
        Tuệ (Customer) <i className="bi bi-caret-down"></i>
      </Label>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Stack alignItems="center" p={1} sx={{ width: STYLE.DESKTOP.ACCOUNT_POPOVER.WIDTH }}>
          <Avatar
            name="Tuệ (Customer)"
            src="/product-card-2.jpg"
            sx={{
              width: STYLE.DESKTOP.ACCOUNT_POPOVER.AVATAR_SIZE,
              height: STYLE.DESKTOP.ACCOUNT_POPOVER.AVATAR_SIZE,
            }}
          />
          <MenuList dense sx={{ width: '100%' }}>
            {MENU_OPTIONS.map((menu) => {
              return (
                <Link key={menu.label} href={menu.href}>
                  <MenuItem>
                    <ListItemIcon>{menu.icon}</ListItemIcon>
                    {menu.label}
                  </MenuItem>
                </Link>
              );
            })}
            <Divider />
            <MenuItem onClick={signOut}>
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              Log out
            </MenuItem>
          </MenuList>
        </Stack>
      </Popover>
    </Fragment>
  );
};

const Label = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  padding: '0px 10px',
  transition: '0.3s',
  borderBottom: '1px solid transparent',
  textTransform: 'capitalize',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

export default AccountPopover;

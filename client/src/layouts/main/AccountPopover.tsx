import { useState, MouseEvent, Fragment } from 'react';
import { styled, Popover, Stack, Divider, MenuList, MenuItem, ListItemIcon } from '@mui/material';
import { Link, Avatar } from '@/components/overrides';
import { PATH_IMAGE } from '@/configs/routers';
import { STYLE } from '@/configs/constants';
import { CustomerState } from '@/redux/slices/customer.slice';
import { buildImageLink } from '@/utils';
import { AccountOption } from './Navbars';

interface AccountPopoverProps {
  profile: CustomerState['profile'];
  accountOptions: AccountOption[];
  signOut: () => void;
}

const AccountPopover = (props: AccountPopoverProps) => {
  const { profile, accountOptions, signOut } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { name, avatar_url } = profile;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Label onClick={handleClick}>
        {name ?? 'Tipe User'} <i className="bi bi-caret-down"></i>
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
            name={name ?? 'avatar'}
            src={avatar_url ? buildImageLink(avatar_url) : `${PATH_IMAGE.root}avatar.png`}
            sx={{
              width: STYLE.DESKTOP.ACCOUNT_POPOVER.AVATAR_SIZE,
              height: STYLE.DESKTOP.ACCOUNT_POPOVER.AVATAR_SIZE,
            }}
          />
          <MenuList dense sx={{ width: '100%' }}>
            {accountOptions.map((option) => {
              const { label, icon, href } = option;
              return (
                <Link key={label} href={href}>
                  <MenuItem>
                    <ListItemIcon>{icon}</ListItemIcon>
                    {label}
                  </MenuItem>
                </Link>
              );
            })}
            <Divider />
            <MenuItem onClick={signOut}>
              <ListItemIcon>
                <i className="bi bi-box-arrow-right" />
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
  },
}));

export default AccountPopover;

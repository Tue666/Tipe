import { Fragment, ReactNode, MouseEvent } from 'react';
import { useTheme, SxProps, Alert } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { Hidden } from '@/components';
import useModal from '@/hooks/useModal';
import useAuth from '@/hooks/useAuth.hook';
import { useAppSelector } from '@/redux/hooks';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { STYLE } from '@/configs/constants';
import { PATH_CUSTOMER, PATH_MAIN } from '@/configs/routers';
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';

export interface Menu {
  icon: ReactNode;
  title: string;
  href: string;
  target: '_self' | '_blank';
}

const CONNECTS: Menu[] = [
  {
    icon: <i className="bi bi-file-arrow-down" />,
    title: 'Download app',
    href: 'https://www.facebook.com/exe.shiro',
    target: '_blank',
  },
  {
    icon: <i className="bi bi-code-slash" />,
    title: 'Connect',
    href: 'https://www.facebook.com/exe.shiro',
    target: '_blank',
  },
];

const APPS: Menu[] = [
  {
    icon: <i className="bi bi-file-earmark-richtext" />,
    title: 'News',
    href: PATH_MAIN.news,
    target: '_self',
  },
  {
    icon: <i className="bi bi-question-circle" />,
    title: 'Support',
    href: 'https://www.facebook.com/exe.shiro',
    target: '_blank',
  },
];

export interface AccountOption {
  label: string;
  icon: ReactNode;
  href: string;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  {
    label: 'My Profile',
    icon: <i className="bi bi-menu-button-wide" />,
    href: PATH_CUSTOMER.profile,
  },
  {
    label: 'My Orders',
    icon: <i className="bi bi-bag-check" />,
    href: PATH_CUSTOMER.orders,
  },
  {
    label: 'My Addresses',
    icon: <i className="bi bi-geo-alt" />,
    href: PATH_CUSTOMER.addresses,
  },
];

const Navbars = () => {
  const theme = useTheme();
  const auth = useAuth();
  const confirm = useConfirm();
  const { openModal } = useModal();
  const { profile } = useAppSelector(selectCustomer);

  const menuItemStyle: SxProps = {
    ...theme.typography.body2,
    padding: STYLE.DESKTOP.HEADER.NAVBARS.ITEM_PADDING,
    transition: '0.3s',
    textTransform: 'capitalize',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  };

  const handleClickSignIO = (e: MouseEvent) => {
    e.preventDefault();
    openModal({ key: 'authentication' });
  };
  const handleClickSignOut = async (signOut: () => void) => {
    try {
      await confirm({
        title: 'Sign Out',
        content: <Alert severity="error">You are about to sign out!</Alert>,
        confirmationButtonProps: {
          color: 'error',
        },
      });
      signOut();
    } catch (error) {
      if (error === undefined) return;
      console.log('Confirm error:', error);
    }
  };
  return (
    <Fragment>
      <Hidden breakpoint="md" type="Down">
        <MenuDesktop
          auth={auth}
          profile={profile}
          connects={CONNECTS}
          apps={APPS}
          accountOptions={ACCOUNT_OPTIONS}
          menuItemStyle={menuItemStyle}
          handleClickSignIO={handleClickSignIO}
          handleClickSignOut={handleClickSignOut}
        />
      </Hidden>
      <Hidden breakpoint="md" type="Up">
        <MenuMobile
          auth={auth}
          profile={profile}
          apps={APPS}
          accountOptions={ACCOUNT_OPTIONS}
          menuItemStyle={menuItemStyle}
          handleClickSignIO={handleClickSignIO}
          handleClickSignOut={handleClickSignOut}
        />
      </Hidden>
    </Fragment>
  );
};

export default Navbars;

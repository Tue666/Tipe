import { Fragment } from 'react';
import { styled } from '@mui/material';
import { STYLE } from '@/configs/constants';
import Navbars from './Navbars';
import Shortcuts from './Shortcuts';

const Header = () => {
  return (
    <Fragment>
      <Root>
        <Navbars />
        <Shortcuts />
      </Root>
      <HeaderSpacing />
    </Fragment>
  );
};

const Root = styled('div')(({ theme }) => ({
  height: STYLE.DESKTOP.HEADER.HEIGHT,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: STYLE.DESKTOP.HEADER.PADDING,
  backgroundColor: theme.palette.background.paper,
  zIndex: 999,
  [theme.breakpoints.down('sm')]: {
    padding: STYLE.MOBILE.HEADER.PADDING,
  },
}));

const HeaderSpacing = styled('div')({
  height: STYLE.DESKTOP.HEADER.HEIGHT,
  marginBottom: STYLE.DESKTOP.HEADER.SPACING_BOTTOM,
});

export default Header;

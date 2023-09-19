import { ReactNode } from 'react';
import type { LinkProps as MUILinkProps } from '@mui/material';
import { Link as MUILink } from '@mui/material';
import { default as NextLink } from 'next/link';

interface LinkProps extends MUILinkProps {
  children: ReactNode;
}

const Link = (props: LinkProps) => {
  const { children, sx, ...rest } = props;
  return (
    <MUILink
      component={NextLink}
      sx={{
        ...sx,
        textDecoration: 'none',
        color: 'text.primary',
      }}
      {...rest}
    >
      {children}
    </MUILink>
  );
};

export default Link;

import { ReactNode } from "react";
import type { LinkProps as MUILinkProps } from "@mui/material";
import { Link as MUILink } from "@mui/material";
import { default as NextLink } from "next/link";

interface LinkProps extends MUILinkProps {
  children: ReactNode;
}

const Link = ({ children, sx, ...props }: LinkProps) => {
  return (
    <MUILink
      component={NextLink}
      sx={{
        ...sx,
        textDecoration: "none",
        color: "text.primary",
      }}
      {...props}
    >
      {children}
    </MUILink>
  );
};

export default Link;

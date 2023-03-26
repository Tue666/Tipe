import { Fragment } from "react";
import { useTheme, Stack, Typography, SxProps } from "@mui/material";

// components
import { Link } from "@/components/overrides";
import Hidden from "@/components/Hidden";

const CONNECTS = [
  {
    icon: <i className="bi bi-file-arrow-down" />,
    title: "Download app",
    href: "https://www.facebook.com/exe.shiro",
    target: "_blank",
  },
  {
    icon: <i className="bi bi-code-slash" />,
    title: "Connect",
    href: "https://www.facebook.com/exe.shiro",
    target: "_blank",
  },
];

const APPS = [
  {
    icon: <i className="bi bi-file-earmark-richtext" />,
    title: "News",
    href: "",
    target: "_self",
  },
  {
    icon: <i className="bi bi-question-circle" />,
    title: "Support",
    href: "https://www.facebook.com/exe.shiro",
    target: "_blank",
  },
];

const Navbars = () => {
  const theme = useTheme();
  const navItemStyle: SxProps = {
    ...theme.typography.body2,
    padding: "0px 10px",
    transition: "0.3s",
    borderBottom: "1px solid transparent",
    textTransform: "capitalize",
    "&:hover": {
      color: theme.palette.primary.main,
      borderBottom: `1px solid ${theme.palette.primary.main}`,
    },
  };
  return (
    <Fragment>
      <Hidden breakpoint="md" type="Down">
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" justifyContent="space-between">
            {CONNECTS &&
              CONNECTS.map((connect, index) => {
                const { icon, title, href, target } = connect;
                return (
                  <Link
                    key={index}
                    href={href}
                    target={target}
                    sx={{ ...navItemStyle }}
                  >
                    {icon} {title}
                  </Link>
                );
              })}
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            {APPS &&
              APPS.map((app, index) => {
                const { icon, title, href, target } = app;
                return (
                  <Link
                    key={index}
                    href={href}
                    target={target}
                    sx={{ ...navItemStyle }}
                  >
                    {icon} {title}
                  </Link>
                );
              })}
            <Typography
              sx={{
                ...navItemStyle,
                cursor: "pointer",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Sign in / Sign up
            </Typography>
          </Stack>
        </Stack>
      </Hidden>
      <Hidden breakpoint="md" type="Up">
        <Typography
          sx={{
            ...navItemStyle,
            cursor: "pointer",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          <i className="bi bi-list"></i>
        </Typography>
      </Hidden>
    </Fragment>
  );
};

export default Navbars;

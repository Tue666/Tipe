import { ReactNode } from "react";
import { useMediaQuery, useTheme, Breakpoint } from "@mui/material";

interface HiddenProps {
  breakpoint: Breakpoint;
  type: "Up" | "Down";
  children: ReactNode;
}

const Hidden = ({ breakpoint, type, children }: HiddenProps) => {
  const theme = useTheme();
  const hiddenUp = useMediaQuery(theme.breakpoints.up(breakpoint));
  const hiddenDown = useMediaQuery(theme.breakpoints.down(breakpoint));

  if (type === "Up") return hiddenUp ? <></> : <>{children}</>;
  if (type === "Down") return hiddenDown ? <></> : <>{children}</>;
  return <></>;
};

export default Hidden;

import { ReactNode } from "react";
import { SpeedDial, SpeedDialAction, styled } from "@mui/material";
import { Api, Navigation } from "@mui/icons-material";

// configs
import { STYLE } from "@/configs/constants";

interface ActionProps {
  title: string;
  icon: ReactNode;
}

interface TeleportProps {
  actions?: ActionProps[];
}

const Teleport = ({ actions }: TeleportProps) => {
  return (
    <Root ariaLabel="SpeedDial openIcon" icon={<Api />}>
      <SpeedDialAction
        key="Teleport to the TOP"
        icon={<Navigation />}
        tooltipTitle="Teleport to the TOP"
        onClick={() => window.scrollTo(0, 0)}
      />
      {actions &&
        actions.map((action) => (
          <SpeedDialAction
            key={action.title}
            icon={action.icon}
            tooltipTitle={action.title}
          />
        ))}
    </Root>
  );
};

const Root = styled(SpeedDial)(({ theme }) => ({
  position: "fixed",
  right: STYLE.DESKTOP.TELEPORT.FROM_RIGHT,
  bottom: STYLE.DESKTOP.TELEPORT.FROM_BOTTOM,
  transition: "0.5s",
  "& > button": {
    backgroundColor: theme.palette.primary.main,
    "& > svg": {
      transition: "0.5s",
      transform: "rotate(0deg) scale(1)",
    },
  },
  "& > button:hover": {
    backgroundColor: theme.palette.primary.light,
    "& > svg": {
      transform: "rotate(360deg) scale(1.1)",
    },
  },
  [theme.breakpoints.down("md")]: {
    right: STYLE.MOBILE.TELEPORT.FROM_RIGHT,
    bottom: STYLE.MOBILE.TELEPORT.FROM_BOTTOM,
  },
}));

export default Teleport;

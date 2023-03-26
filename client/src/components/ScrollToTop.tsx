import { ReactNode } from "react";
import { Link } from "react-scroll";

// configs
import { STYLE } from "@/configs/constants";

const ScrollToTop = () => {
  return null;
};

export default ScrollToTop;

// combile SpeedDial & react-scroll

export const combineLink = (to: string, children: ReactNode) => (
	<Link to={to} duration={500} offset={parseInt(STYLE.DESKTOP.HEADER.HEIGHT) * -1}>
		{children}
	</Link>
);

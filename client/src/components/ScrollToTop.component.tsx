import { ReactNode } from 'react';
import { Link } from 'react-scroll';
import { STYLE } from '@/configs/constants';

const ScrollToTop = () => {
  return null;
};

export default ScrollToTop;

// combile SpeedDial & react-scroll
interface CombineLinkProps {
  to: string;
  children: ReactNode;
}

export const combineLink = (props: CombineLinkProps) => {
  const { to, children } = props;
  return (
    <Link to={to} duration={500} offset={parseInt(STYLE.DESKTOP.HEADER.HEIGHT) * -1}>
      {children}
    </Link>
  );
};

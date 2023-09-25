import { styled } from '@mui/material';
import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from '@mui/icons-material';
import { Settings } from 'react-slick';
import { ReactNode } from 'react';

export type ArrowSide = 'prev' | 'next';

const ARROW = {
  WIDTH: '50px',
  HEIGHT: '50%',
};
const DOT_SIZE = '8px';

interface ArrowProps {
  children: ReactNode;
  side: ArrowSide;
  onClick?: any;
}

const Arrow = ({ children, side, onClick }: ArrowProps) => {
  return (
    <Button side={side} onClick={onClick}>
      {children}
    </Button>
  );
};

export const defaultSettings: Settings = {
  infinite: true,
  dots: true,
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 500,
  autoplaySpeed: 5000,
  prevArrow: (
    <Arrow side="prev">
      <ArrowBackIosOutlined />
    </Arrow>
  ),
  nextArrow: (
    <Arrow side="next">
      <ArrowForwardIosOutlined />
    </Arrow>
  ),
  appendDots: (dots) => <Dots>{dots}</Dots>,
  customPaging: () => <Paging />,
};

const Button = styled('button')(({ side }: { side: ArrowSide }) => ({
  width: ARROW.WIDTH,
  height: ARROW.HEIGHT,
  backgroundColor: 'rgba(0,0,0,0.1)',
  color: '#fff',
  position: 'absolute',
  bottom: `calc(50% - ${parseInt(ARROW.HEIGHT) / 2}%)`,
  left: side === 'prev' ? 0 : `calc(100% - ${ARROW.WIDTH})`,
  outline: 'none',
  border: 'none',
  zIndex: 99,
  opacity: 0,
  transition: '0.3s',
  cursor: 'pointer',
  clipPath: `polygon(${
    side === 'prev'
      ? '70% 0, 100% 10%, 100% 90%, 70% 100%, 0 100%, 0 0'
      : '30% 0, 100% 0, 100% 100%, 30% 100%, 0 90%, 0 10%'
  })`,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: 'rgba(255,255,255,0.8)',
  },
}));

const Dots = styled('ul')(({ theme }) => ({
  display: 'flex !important',
  justifyContent: 'end',
  bottom: '0 !important',
  '& li.slick-active div': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const Paging = styled('div')({
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: '50%',
  margin: '0 5px',
  backgroundColor: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
});

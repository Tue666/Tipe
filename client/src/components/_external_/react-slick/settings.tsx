import { ReactNode } from 'react';
import { Settings } from 'react-slick';
import { styled } from '@mui/material';
import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from '@mui/icons-material';
import { STYLE } from '@/configs/constants';

type ArrowSide = 'prev' | 'next';

type ArrowButtonProps = {
  side: ArrowSide;
  disabled: boolean;
};

interface ArrowProps {
  children: ReactNode;
  side: ArrowSide;
  onClick?: any;
  className?: string;
}

const Arrow = ({ children, side, onClick, className }: ArrowProps) => {
  const disabled = className?.indexOf('slick-disabled') !== -1;
  return (
    <ArrowButton side={side} disabled={disabled} onClick={onClick}>
      {children}
    </ArrowButton>
  );
};

export const defaultSettings: Settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 200,
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

const ArrowButton = styled('button')<ArrowButtonProps>(({ side, disabled }) => ({
  width: STYLE.DESKTOP.CAROUSEL.DEFAULT_ARROW_WIDTH,
  height: STYLE.DESKTOP.CAROUSEL.DEFAULT_ARROW_HEIGHT,
  backgroundColor: 'rgba(0,0,0,0.1)',
  color: '#fff',
  position: 'absolute',
  bottom: `calc(50% - ${parseInt(STYLE.DESKTOP.CAROUSEL.DEFAULT_ARROW_HEIGHT) / 2}%)`,
  left: side === 'prev' ? 0 : `calc(100% - ${STYLE.DESKTOP.CAROUSEL.DEFAULT_ARROW_WIDTH})`,
  display: disabled ? 'none' : 'block',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  width: STYLE.DESKTOP.CAROUSEL.DEFAULT_DOT_SIZE,
  height: STYLE.DESKTOP.CAROUSEL.DEFAULT_DOT_SIZE,
  borderRadius: '50%',
  margin: '0 5px',
  backgroundColor: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
});

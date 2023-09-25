import { ReactNode } from 'react';
import { styled } from '@mui/material';

interface ContentToggleProps {
  children: ReactNode;
}

const ContentToggle = (props: ContentToggleProps) => {
  const { children } = props;
  return (
    <Root>
      <Input type="checkbox" id="toggle-input" />
      <ToggleButton htmlFor="toggle-input">
        <i className="bi bi-chevron-double-down"></i>
      </ToggleButton>
      {children}
    </Root>
  );
};

const Root = styled('div')({
  position: 'relative',
});

const ToggleButton = styled('label')(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% - 20px)',
  left: 'calc(50% - 20px)',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  backgroundColor: 'rgba(255,255,255,0.5)',
  boxShadow: '0px -2px 7px rgb(1 1 1 / 15%)',
  transition: '0.5s',
  lineHeight: '40px',
  textAlign: 'center',
  fontSize: '17px',
  zIndex: 9,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

const Input = styled('input')(({ theme }) => ({
  width: 0,
  height: 0,
  display: 'none',
  '&:checked + label': {
    transform: 'rotate(180deg)',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    boxShadow: '0px -2px 7px rgb(233 129 129)',
  },
  '&:checked ~ div': {
    maxHeight: '1000px',
  },
}));

export default ContentToggle;

import { ReactNode } from 'react';
import type { ContainerProps as MUIContainerProps } from '@mui/material';
import { Container as MUIContainer } from '@mui/material';

interface ContainerProps extends MUIContainerProps {
  children: ReactNode;
}

const Container = ({ children, ...props }: ContainerProps) => {
  return <MUIContainer {...props}>{children}</MUIContainer>;
};

export default Container;

import { ReactNode } from 'react';
import type { ContainerProps as MUIContainerProps } from '@mui/material';
import { Container as MUIContainer } from '@mui/material';

interface ContainerProps extends MUIContainerProps {
  children: ReactNode;
}

const Container = (props: ContainerProps) => {
  const { children, ...rest } = props;
  return <MUIContainer {...rest}>{children}</MUIContainer>;
};

export default Container;

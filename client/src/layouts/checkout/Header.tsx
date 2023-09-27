import { useRouter } from 'next/router';
import { Step, StepLabel, Stepper, styled } from '@mui/material';
import { Logo } from '@/components';
import { STYLE } from '@/configs/constants';
import { PATH_CHECKOUT } from '@/configs/routers';

const STEPS = [
  {
    href: '',
    value: 0,
    label: 'Sign in',
  },
  {
    href: PATH_CHECKOUT.shipping,
    value: 1,
    label: 'Delivery address',
  },
  {
    href: PATH_CHECKOUT.payment,
    value: 2,
    label: 'Order & Payment',
  },
];

const Header = () => {
  const { pathname } = useRouter();
  const currentStep = STEPS.find((step) => step.href === pathname);
  return (
    <Root>
      <Logo />
      <Stepper activeStep={currentStep?.value ?? 0} alternativeLabel sx={{ flex: '4 1 0%' }}>
        {STEPS.map((step) => {
          const { value, label } = step;
          return (
            <Step key={value}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  height: STYLE.DESKTOP.HEADER.HEIGHT,
  display: 'flex',
  alignItems: 'center',
  padding: STYLE.DESKTOP.PADDING,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    padding: '5px',
  },
}));

export default Header;

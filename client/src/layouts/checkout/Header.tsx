import { Step, StepLabel, Stepper, Tooltip, styled } from '@mui/material';
import { Logo } from '@/components';
import { STYLE } from '@/configs/constants';
import { Image } from '@/components/overrides';

const STEPS = ['Sign in', 'Delivery address', 'Order & Payment'];

const Header = () => {
  return (
    <Root>
      <Logo />
      <Stepper activeStep={1} alternativeLabel sx={{ flex: '4 1 0%' }}>
        {STEPS.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Tooltip placement="bottom" title="Cre from Tiki :D" arrow sx={{ flex: '1 1 0%' }}>
        <Image
          alt="Tiki hotline"
          src="/download/play-store.png"
          sx={{ width: '176px', height: '42px' }}
        />
      </Tooltip>
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

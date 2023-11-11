import { Stack, Typography, styled } from '@mui/material';
import useTimer from '@/hooks/useTimer.hook';

const FlipCountdownTimer = () => {
  const [days, hours, minutes, seconds] = useTimer(1699722000000);
  console.log('render');
  console.log(days, hours, minutes, seconds);
  return (
    <Stack direction="row" spacing={1}>
      <Timer>
        <Typography variant="subtitle2">{days < 10 ? `0${days}` : days}</Typography>
      </Timer>
      <Timer>
        <Typography variant="subtitle2">{hours < 10 ? `0${hours}` : hours}</Typography>
      </Timer>
      <Timer>
        <Typography variant="subtitle2">{minutes < 10 ? `0${minutes}` : minutes}</Typography>
      </Timer>
      <Timer>
        <Typography variant="subtitle2">{seconds < 10 ? `0${seconds}` : seconds}</Typography>
      </Timer>
    </Stack>
  );
};

const Timer = styled('div')({
  width: '21px',
  height: '19px',
  lineHeight: '19px',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '4px',
  textAlign: 'center',
});

export default FlipCountdownTimer;

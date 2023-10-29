import { styled } from '@mui/material/styles';
import { Stack, Typography, TextField, InputAdornment, Button } from '@mui/material';
import { Close, ConfirmationNumberOutlined, Send } from '@mui/icons-material';
import useModal from '../../hooks/useModal';

const AppPromotion = () => {
  const { closeModal } = useModal();
  return (
    <RootStyle p={2} spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Tipe Promotion
        </Typography>
        <Close onClick={closeModal} sx={{ cursor: 'pointer' }} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Enter discount code"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ConfirmationNumberOutlined />
              </InputAdornment>
            ),
          }}
        />
        <Button disabled variant="contained" disableElevation endIcon={<Send />}>
          APPLY
        </Button>
      </Stack>
      <Scroll>
        <Stack>
          <Typography variant="subtitle2">Discount code</Typography>
        </Stack>
        <Stack spacing={2}></Stack>
      </Scroll>
    </RootStyle>
  );
};

const RootStyle = styled(Stack)(({ theme }) => ({
  width: '480px',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
}));

const Scroll = styled('div')({
  maxHeight: '425px',
  overflowY: 'scroll',
});

export default AppPromotion;

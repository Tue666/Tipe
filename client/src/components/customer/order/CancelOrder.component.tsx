import { FocusEvent, useState } from 'react';
import { Stack, Typography, TextField, Button } from '@mui/material';
import { ModalParams } from '@/redux/slices/modal.slice';
import { IOrder } from '@/models/interfaces';
import useModal from '@/hooks/useModal';
import orderApi from '@/apis/orderApi';
import { enqueueNotify } from '@/hooks/useSnackbar';
import { AxiosError } from 'axios';

interface CancelOrderParams {
  _id: IOrder.Order['_id'];
}

const CancelOrder = (params: ModalParams) => {
  const { props } = params;
  const { _id } = props as CancelOrderParams;
  const [note, setNote] = useState('');
  const { closeModal } = useModal();

  const handleChangeNote = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNote(value);
  };
  const handleConfirm = async () => {
    try {
      await orderApi.trackingOrder({});
      enqueueNotify('Order has been canceled', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } catch (error) {
      enqueueNotify((error as AxiosError)?.response?.statusText ?? 'Something went wrong', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
  };
  return (
    <Stack p={3} spacing={1} sx={{ width: '450px' }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        Your feedback is very important to us! <br /> Can you tell us the reason for canceling the
        order?
      </Typography>
      <TextField
        fullWidth
        multiline
        color="secondary"
        rows={4}
        label="Write something here..."
        defaultValue={note}
        onBlur={handleChangeNote}
      />
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          disableElevation
          onClick={handleConfirm}
        >
          CONFIRM
        </Button>
        <Button fullWidth variant="outlined" onClick={closeModal}>
          CLOSE
        </Button>
      </Stack>
    </Stack>
  );
};

export default CancelOrder;

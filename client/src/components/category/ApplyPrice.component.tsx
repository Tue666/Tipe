import { ReadMore } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';
import { Fragment } from 'react';

const ApplyPrice = () => {
  return (
    <Fragment>
      <Stack direction="row" spacing={2} my={2}>
        <TextField label="From" variant="standard" color="error" />
        <TextField label="To" variant="standard" color="error" />
      </Stack>
      <Button color="error" variant="contained" startIcon={<ReadMore />} disableElevation>
        Apply
      </Button>
    </Fragment>
  );
};

export default ApplyPrice;

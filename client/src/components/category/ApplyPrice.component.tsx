import { ReadMore } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';
import { Fragment } from 'react';

const ApplyPrice = () => {
  return (
    <Fragment>
      <Stack direction="row" spacing={2} my={2}>
        <TextField label="From" variant="standard" />
        <TextField label="To" variant="standard" />
      </Stack>
      <Button variant="contained" startIcon={<ReadMore />} disableElevation>
        Apply
      </Button>
    </Fragment>
  );
};

export default ApplyPrice;

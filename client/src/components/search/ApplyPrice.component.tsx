import { ChangeEvent, Fragment, useState } from 'react';
import { ReadMore } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';
import { ISchema } from '@/models/interfaces';

interface ApplyPriceProps {
  handleChangeQueryParam: (
    key: ISchema.Attribute['k'],
    value: ISchema.Attribute['v'],
    isMultiple?: boolean,
    resetPage?: boolean
  ) => void;
}

const ApplyPrice = (props: ApplyPriceProps) => {
  const { handleChangeQueryParam } = props;
  const [from, setFrom] = useState('0');
  const [to, setTo] = useState('0');

  const handleChangeFrom = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/^0+/, '');
    if (from !== '0' && value === '') value = '0';
    if (!/^\d+$/.test(value)) return;
    setFrom(value);
  };
  const handleChangeTo = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/^0+/, '');
    if (to !== '0' && value === '') value = '0';
    if (!/^\d+$/.test(value)) return;
    setTo(value);
  };
  const handleApplyPrice = () => {
    handleChangeQueryParam('price', `${from}-${to}`, false, true);
  };
  return (
    <Fragment>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField value={from} label="From" variant="standard" onChange={handleChangeFrom} />
        <TextField value={to} label="To" variant="standard" onChange={handleChangeTo} />
      </Stack>
      <Button
        variant="contained"
        startIcon={<ReadMore />}
        disableElevation
        onClick={handleApplyPrice}
      >
        Apply
      </Button>
    </Fragment>
  );
};

export default ApplyPrice;

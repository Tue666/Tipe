import { Stack, TextField, MenuItem } from '@mui/material';

const DateOfBirth = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
      <TextField fullWidth value="" select label="Day" size="small" color="secondary">
        <MenuItem value="">Day</MenuItem>
        <MenuItem value={1}>11</MenuItem>
      </TextField>
      <TextField fullWidth value="" select label="Month" size="small" color="secondary">
        <MenuItem value="">Month</MenuItem>
        <MenuItem value={1}>11</MenuItem>
      </TextField>
      <TextField fullWidth value="" select label="Year" size="small" color="secondary">
        <MenuItem value="">Year</MenuItem>
        <MenuItem value={1}>11</MenuItem>
      </TextField>
    </Stack>
  );
};

export default DateOfBirth;

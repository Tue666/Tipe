import { Fragment } from 'react';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { STYLE } from '@/configs/constants';
import { IAccount } from '@/models/interfaces';

interface LocationProps {
  regions: IAccount.Address['region'][];
  location: {
    region: IAccount.Address['region']['_id'];
    district: IAccount.Address['district']['_id'];
    ward: IAccount.Address['ward']['_id'];
  };
}

const Location = (props: LocationProps) => {
  const { regions, location } = props;
  const region = regions.find((region) => region._id === location.region);
  return (
    <Fragment>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
        <Typography
          variant="subtitle2"
          sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
        >
          Province / City
        </Typography>
        <TextField
          value={region?._id || ''}
          fullWidth
          select
          label="Select Province / City"
          size="small"
          color="secondary"
          //   onChange={handleChangeRegion}
          //   error={Boolean(errors.region)}
          //   helperText={errors.region}
        >
          <MenuItem value="">Select Province / City</MenuItem>
          {regions.length > 0 &&
            regions.map((region) => {
              const { _id, name } = region;
              return (
                <MenuItem key={_id} value={_id}>
                  {name}
                </MenuItem>
              );
            })}
        </TextField>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
        <Typography
          variant="subtitle2"
          sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
        >
          District
        </Typography>
        <TextField
          //   value={hasDistrict?._id || ''}
          fullWidth
          select
          label="Select District"
          size="small"
          color="secondary"
          //   onChange={handleChangeDistrict}
          //   error={Boolean(errors.district)}
          //   helperText={errors.district}
        >
          <MenuItem value="">Select District</MenuItem>
          {/* {state.districts.length > 0 &&
            state.districts.map((district) => {
              const { _id, name } = district;
              return (
                <MenuItem key={_id} value={_id}>
                  {name}
                </MenuItem>
              );
            })} */}
        </TextField>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
        <Typography
          variant="subtitle2"
          sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
        >
          Ward
        </Typography>
        <TextField
          //   value={hasWard?._id || ''}
          fullWidth
          select
          label="Select Ward"
          size="small"
          color="secondary"
          //   onChange={handleChangeWard}
          //   error={Boolean(errors.ward)}
          //   helperText={errors.ward}
        >
          <MenuItem value="">Select Ward</MenuItem>
          {/* {state.wards.length > 0 &&
            state.wards.map((ward) => {
              const { _id, name } = ward;
              return (
                <MenuItem key={_id} value={_id}>
                  {name}
                </MenuItem>
              );
            })} */}
        </TextField>
      </Stack>
    </Fragment>
  );
};

export default Location;

import { ChangeEvent, Fragment } from 'react';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { STYLE } from '@/configs/constants';
import { ILocation } from '@/models/interfaces';
import { LocationFormProps } from '@/pages/customer/addresses/form';
import { Scope } from '@/models/interfaces/schema';

interface LocationProps {
  locations: ILocation.FindResponse;
  currentLocation: {
    currentRegion: ILocation.FindResponse['regions'][number]['_id'];
    currentDistrict: ILocation.FindResponse['districts'][number]['_id'];
    currentWard: ILocation.FindResponse['wards'][number]['_id'];
  };
  handleSelectedLocation: (changed: Partial<LocationFormProps>) => void;
}

const Location = (props: LocationProps) => {
  const { locations, currentLocation, handleSelectedLocation } = props;
  const { regions, districts, wards } = locations;
  const { currentRegion, currentDistrict, currentWard } = currentLocation;
  const region = regions.find((region) => region._id === currentRegion);
  const district = districts.find((district) => district._id === currentDistrict);
  const districtOptions = region
    ? districts.filter((district) => district.parent_id === region._id)
    : [];
  const ward = wards.find((ward) => ward._id === currentWard);
  const wardOptions = district ? wards.filter((ward) => ward.parent_id === district._id) : [];

  const handleChangeLocation = (e: ChangeEvent<HTMLInputElement>, scope: Scope) => {
    const value = e.target.value;
    switch (scope) {
      case 'REGION':
        handleSelectedLocation({
          region: value,
          district: '',
          ward: '',
        });
        break;
      case 'DISTRICT':
        handleSelectedLocation({
          district: value,
          ward: '',
        });
        break;
      case 'WARD':
        handleSelectedLocation({
          ward: value,
        });
        break;
      default:
        break;
    }
  };
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLocation(e, 'REGION')}
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
          value={district?._id || ''}
          fullWidth
          select
          label="Select District"
          size="small"
          color="secondary"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLocation(e, 'DISTRICT')}
          //   error={Boolean(errors.district)}
          //   helperText={errors.district}
        >
          <MenuItem value="">Select District</MenuItem>
          {districtOptions.length > 0 &&
            districtOptions.map((district) => {
              const { _id, name } = district;
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
          Ward
        </Typography>
        <TextField
          value={ward?._id || ''}
          fullWidth
          select
          label="Select Ward"
          size="small"
          color="secondary"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLocation(e, 'WARD')}
          //   error={Boolean(errors.ward)}
          //   helperText={errors.ward}
        >
          <MenuItem value="">Select Ward</MenuItem>
          {wardOptions.length > 0 &&
            wardOptions.map((ward) => {
              const { _id, name } = ward;
              return (
                <MenuItem key={_id} value={_id}>
                  {name}
                </MenuItem>
              );
            })}
        </TextField>
      </Stack>
    </Fragment>
  );
};

export default Location;

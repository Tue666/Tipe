import _ from 'lodash';
import { FocusEvent } from 'react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Page } from '@/components';
import { PageWithLayout } from '@/pages/_app';
import CustomerLayout from '@/layouts/customer';
import MainLayout from '@/layouts/main';
import { FormikProvider, Form as FormikForm, useFormik } from 'formik';
import { Location } from '@/components/customer';
import { useAppSelector } from '@/redux/hooks';
import { selectCustomer } from '@/redux/slices/customer.slice';
import { STYLE } from '@/configs/constants';
import locationApi from '@/apis/locationApi';
import { IAccount } from '@/models/interfaces';

interface FormProps {
  regions: IAccount.Address['region'][];
}

const Form: PageWithLayout<FormProps> = (props: FormProps) => {
  const { regions } = props;
  const { addresses } = useAppSelector(selectCustomer);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentAddress = addresses.find((address) => address._id === searchParams.get('_id'));
  const formik = useFormik({
    initialValues: {
      name: currentAddress?.name || '',
      company: currentAddress?.company || '',
      phoneNumber: currentAddress?.phone_number || '',
      location: currentAddress
        ? {
            region: currentAddress.region._id,
            district: currentAddress.district._id,
            ward: currentAddress.ward._id,
          }
        : {
            region: '',
            district: '',
            ward: '',
          },
      street: currentAddress?.street || '',
      addressType: currentAddress?.delivery_address_type || 'home',
      isDefault: currentAddress?.is_default || false,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const { values, touched, errors, isSubmitting, handleBlur, setFieldValue } = formik;

  const handleBack = () => {
    router.back();
  };
  const handleChangeInput = (e: FocusEvent<HTMLInputElement>) => {
    handleBlur(e);
    const value = e.target.value;
    setFieldValue(e.target.name, value);
  };
  return (
    <Page title={`${currentAddress ? 'Edit' : 'Add new'} address | Tipe`}>
      <FormikProvider value={formik}>
        <FormikForm>
          <Root spacing={1} p={3}>
            <ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={handleBack} />
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
              <Typography
                variant="subtitle2"
                sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
              >
                First - Last name
              </Typography>
              <TextField
                fullWidth
                name="name"
                label="Enter your full name"
                variant="outlined"
                size="small"
                color="secondary"
                defaultValue={values.name}
                onBlur={handleChangeInput}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
              <Typography
                variant="subtitle2"
                sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
              >
                Company
              </Typography>
              <TextField
                fullWidth
                name="company"
                label="Enter your company name"
                variant="outlined"
                size="small"
                color="secondary"
                defaultValue={values.company}
                onBlur={handleChangeInput}
                error={Boolean(touched.company && errors.company)}
                helperText={touched.company && errors.company}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
              <Typography
                variant="subtitle2"
                sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
              >
                Phone number
              </Typography>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Enter your phone number"
                variant="outlined"
                size="small"
                color="secondary"
                defaultValue={values.phoneNumber}
                onBlur={handleChangeInput}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
            </Stack>
            <Location regions={regions} location={values.location} />
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
              <Typography
                variant="subtitle2"
                sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
              >
                Street
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="street"
                label="Enter your street"
                color="secondary"
                defaultValue={values.street}
                onBlur={handleChangeInput}
                error={Boolean(touched.street && errors.street)}
                helperText={touched.street && errors.street}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
              <Typography
                variant="subtitle2"
                sx={{ width: STYLE.DESKTOP.CUSTOMER.ADDRESSES.TITLE_SPACE }}
              >
                Address type
              </Typography>
              <FormControl>
                <RadioGroup row value={values.addressType} onChange={() => {}}>
                  <FormControlLabel
                    value="home"
                    control={<Radio size="small" />}
                    label="Private house / Apartment"
                  />
                  <FormControlLabel
                    value="company"
                    control={<Radio size="small" />}
                    label="Agency / Company"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Checkbox checked={false} size="small" onClick={() => {}} />
              <Typography variant="subtitle2">I wanna this address is default</Typography>
            </Stack>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              color="success"
              disableElevation
            >
              SAVE CHANGE
            </LoadingButton>
          </Root>
        </FormikForm>
      </FormikProvider>
    </Page>
  );
};

const Root = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
}));

Form.getLayout = (page) => {
  return (
    <MainLayout>
      <CustomerLayout>{page}</CustomerLayout>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const regions = await locationApi.findRegionsByCountry('VN');
    if (_.isNil(regions) || _.isEmpty(regions)) {
      console.log('Location generated with error: resources not found');
      return {
        notFound: true,
      };
    }

    return {
      props: {
        regions,
      },
    };
  } catch (error) {
    console.log('Location generated with error:', error);
    return {
      notFound: true,
    };
  }
};

export default Form;

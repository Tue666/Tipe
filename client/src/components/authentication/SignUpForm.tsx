import _ from 'lodash';
import { Stack, Typography, TextField, Alert } from '@mui/material';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { useFormik, FormikProvider, Form } from 'formik';
import { LoadingButton } from '@mui/lab';
import Avatar from '../overrides/Avatar.override';
import { accountApi } from '@/apis';
import { isAxiosError } from 'axios';
import { SignUpPayload } from '@/models/interfaces/account';

interface SignUpFormProps {
  phoneNumber: string;
  socialAccount: any;
  handleBackDefaultState: () => void;
  signUp: (signUpPayload: SignUpPayload) => Promise<void>;
}

const SignUpForm = (props: SignUpFormProps) => {
  const { phoneNumber, socialAccount, handleBackDefaultState, signUp } = props;
  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      passwordConfirm: '',
      afterSubmit: null,
    },
    onSubmit: async (values, { setErrors, resetForm }) => {
      try {
        const signUpPayload: SignUpPayload = {
          phone_number: phoneNumber,
          ...values,
          account_type: 'CUSTOMER',
        };
        await signUp(signUpPayload);
        handleBackDefaultState();
      } catch (error) {
        resetForm();
        if (isAxiosError(error)) {
          setErrors({ afterSubmit: error?.response?.statusText });
        } else {
          setErrors({ afterSubmit: 'Something went wrong' });
        }
      }
    },
  });
  const { touched, errors, isSubmitting, getFieldProps } = formik;
  return (
    <Stack spacing={2}>
      <ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={() => handleBackDefaultState()} />
      {!_.isNull(socialAccount) && (
        <Stack alignItems="center" spacing={1}>
          <Avatar
            name={socialAccount.name}
            src={socialAccount.avatar_url}
            sx={{ width: '100px', height: '100px' }}
          />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {socialAccount.name}
          </Typography>
        </Stack>
      )}
      {_.isNull(socialAccount) && <Typography variant="h6">Create account</Typography>}
      <FormikProvider value={formik}>
        <Form>
          <Stack spacing={2}>
            {_.isNull(socialAccount) && (
              <TextField
                fullWidth
                label="Enter your name"
                variant="standard"
                color="success"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            )}
            <TextField
              fullWidth
              label="Enter password"
              variant="standard"
              color="success"
              type="password"
              {...getFieldProps('password')}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            <TextField
              fullWidth
              label="Confirm your password"
              variant="standard"
              color="success"
              type="password"
              {...getFieldProps('passwordConfirm')}
              error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
              helperText={touched.passwordConfirm && errors.passwordConfirm}
            />
            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              disableElevation
              color="error"
            >
              Sign up
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Stack>
  );
};

export default SignUpForm;

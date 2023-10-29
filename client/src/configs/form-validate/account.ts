import * as yup from 'yup';

export const accountValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required!'),
  password: yup.string().required('Password is required!'),
  passwordConfirm: yup.string().required('Confirm password is required!'),
});

export const addressValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required!'),
  phoneNumber: yup
    .string()
    .required('Phone number is required!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Invalid phone number!'),
  location: yup.object({
    region: yup.string().required('Region is required!'),
    district: yup.string().required('District is required!'),
    ward: yup.string().required('Ward is required!'),
  }),
  street: yup.string().required('Street is required!'),
});

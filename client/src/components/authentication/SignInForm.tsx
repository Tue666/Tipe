import _ from 'lodash';
import { useState, useReducer } from 'react';
import { Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { isAxiosError } from 'axios';
import { IAccount } from '@/models/interfaces';
import { enqueueNotify } from '@/hooks/useSnackbar';

interface SignInState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
}

const initialState: SignInState = {
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const handlers = {
  RESET: (state: SignInState) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      errorMessage: '',
    };
  },
  START_LOADING: (state: SignInState) => {
    return {
      ...state,
      isLoading: true,
    };
  },
  HAS_ERROR: (state: SignInState, action: SignInAction) => {
    const { errorMessage } = action?.payload || {};
    return {
      ...state,
      isLoading: false,
      hasError: true,
      errorMessage: _.isNil(errorMessage) ? state.errorMessage : errorMessage,
    };
  },
};

interface SignInAction {
  type: keyof typeof handlers;
  payload?: Partial<SignInState>;
}

const reducer = (state: SignInState, action: SignInAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface SignInFormProps {
  phoneNumber: string;
  handleBackDefaultState: () => void;
  signIn: (signInBody: IAccount.SignInBody) => Promise<string>;
  closeModal: () => void;
}

const SignInForm = (props: SignInFormProps) => {
  const { phoneNumber, handleBackDefaultState, signIn, closeModal } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      dispatch({ type: 'START_LOADING' });
      const name = await signIn({
        phone_number: phoneNumber,
        password,
      });
      enqueueNotify(`Welcome ${name}, happy shopping with Tipe.`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      closeModal();
    } catch (error) {
      if (isAxiosError(error)) {
        dispatch({
          type: 'HAS_ERROR',
          payload: {
            errorMessage: error?.response?.statusText,
          },
        });
      } else {
        dispatch({
          type: 'HAS_ERROR',
          payload: {
            errorMessage: 'Something went wrong',
          },
        });
      }
    }
  };
  return (
    <Stack spacing={3}>
      <ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={() => handleBackDefaultState()} />
      <div>
        <Typography variant="h6">Enter password</Typography>
        <Typography variant="body2">
          Please enter Tipe password of phone number <strong>{phoneNumber}</strong>
        </Typography>
      </div>
      <TextField
        fullWidth
        label="Password"
        variant="standard"
        color="success"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClick={() => dispatch({ type: 'RESET' })}
        error={state.hasError}
        helperText={state.hasError && state.errorMessage}
      />
      <LoadingButton
        loading={state.isLoading}
        variant="contained"
        color="error"
        disableElevation
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>
    </Stack>
  );
};

export default SignInForm;

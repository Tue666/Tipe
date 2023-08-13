import _ from 'lodash';
import { ChangeEvent, Fragment, useReducer, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, TextField, Typography } from '@mui/material';
import { ModalParams } from '@/redux/slices/modal.slice';
import useModal from '@/hooks/useModal';
import { STYLE } from '@/configs/constants';
import { LoadingButton } from '@mui/lab';
import { Image } from '../overrides';
import { PATH_IMAGE } from '@/configs/routers';
import { isAxiosError } from 'axios';
import AuthSocial from './AuthSocial';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { accountApi } from '@/apis';
import useAuth from '@/hooks/useAuth.hook';

const STATE = {
  authentication: 'authentication',
  signIn: 'sign-in',
  signUp: 'sign-up',
};

interface AuthenticationState {
  isLoading: boolean;
  current: string;
  socialAccount: any;
  hasError: boolean;
  errorMessage: string;
}

const initialState: AuthenticationState = {
  isLoading: false,
  current: STATE.authentication,
  socialAccount: null,
  hasError: false,
  errorMessage: '',
};

const handlers = {
  INITIALIZE: (state: AuthenticationState) => {
    return {
      ...state,
      isLoading: false,
      current: STATE.authentication,
      hasError: false,
      errorMessage: '',
    };
  },
  START_LOADING: (state: AuthenticationState) => {
    return {
      ...state,
      isLoading: true,
    };
  },
  SWITCH_STATE: (state: AuthenticationState, action: AuthenticationAction) => {
    const { current } = action?.payload || {};
    return {
      ...state,
      isLoading: false,
      current: _.isNil(current) ? state.current : current,
    };
  },
  FETCH_SOCIAL_ACCOUNT: (state: AuthenticationState, action: AuthenticationAction) => {
    const { socialAccount } = action?.payload || {};
    return {
      ...state,
      socialAccount: _.isNil(socialAccount) ? state.socialAccount : socialAccount,
    };
  },
  HAS_ERROR: (state: AuthenticationState, action: AuthenticationAction) => {
    const { errorMessage } = action?.payload || {};
    return {
      ...state,
      isLoading: false,
      hasError: true,
      errorMessage: _.isNil(errorMessage) ? state.errorMessage : errorMessage,
    };
  },
  VALIDATE: (state: AuthenticationState, action: AuthenticationAction) => {
    const { hasError, errorMessage } = action?.payload || {};
    return {
      ...state,
      hasError: _.isNil(hasError) ? state.hasError : hasError,
      errorMessage: _.isNil(errorMessage) ? state.errorMessage : errorMessage,
    };
  },
};

interface AuthenticationAction {
  type: keyof typeof handlers;
  payload?: Partial<AuthenticationState>;
}

const reducer = (state: AuthenticationState, action: AuthenticationAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const Authentication = (params: ModalParams) => {
  const { beClosed } = params;
  const { openModal, closeModal } = useModal();
  const { signIn, signUp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleBackDefaultState = (socialAccount = null) => {
    if (socialAccount)
      dispatch({
        type: 'FETCH_SOCIAL_ACCOUNT',
        payload: {
          socialAccount,
        },
      });
    else dispatch({ type: 'INITIALIZE' });
  };
  const handleChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);

    let hasError = false;
    let errorMessage = '';
    if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value)) {
      hasError = true;
      errorMessage = 'Invalid phone number!';
    }
    dispatch({
      type: 'VALIDATE',
      payload: {
        hasError,
        errorMessage,
      },
    });
  };
  const handleContinue = async () => {
    if (state.hasError) return;

    if (_.isEmpty(phoneNumber) || _.isNil(phoneNumber)) {
      dispatch({
        type: 'HAS_ERROR',
        payload: {
          errorMessage: 'Invalid phone number!',
        },
      });
      return;
    }

    try {
      dispatch({ type: 'START_LOADING' });
      const accountExists = await accountApi.verifyExist(phoneNumber);
      if (accountExists) {
        const isSocialAccount = false; //
        if (isSocialAccount) {
          dispatch({
            type: 'HAS_ERROR',
            payload: {
              errorMessage: 'Phone number have been registered',
            },
          });
          return;
        }
        dispatch({
          type: 'SWITCH_STATE',
          payload: {
            current: STATE.signIn,
          },
        });
      } else {
        // Send phone verify goes here...
        dispatch({
          type: 'SWITCH_STATE',
          payload: {
            current: STATE.signUp,
          },
        });
      }
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
    <RootStyle direction="row">
      {beClosed && <CloseButton onClick={closeModal}>X</CloseButton>}
      <LeftContent spacing={5}>
        {state.current === STATE.authentication && (
          <Fragment>
            <Stack spacing={2}>
              <Typography variant="h4">Hello,</Typography>
              {!state.socialAccount && <Typography variant="body1">Sign in or Sign up</Typography>}
              <TextField
                fullWidth
                label="Phone number"
                variant="standard"
                color="success"
                value={phoneNumber}
                onChange={handleChangePhoneNumber}
                error={state.hasError}
                helperText={state.hasError && state.errorMessage}
              />
              <LoadingButton
                loading={state.isLoading}
                variant="contained"
                color="error"
                disableElevation
                onClick={handleContinue}
              >
                Continue
              </LoadingButton>
            </Stack>
            {_.isNull(state.socialAccount) && (
              <AuthSocial
              // handleBackDefaultState={handleBackDefaultState}
              // socialSignIn={socialSignIn}
              // closeModal={closeModal}
              />
            )}
          </Fragment>
        )}
        {state.current === STATE.signIn && (
          <SignInForm
            phoneNumber={phoneNumber}
            handleBackDefaultState={handleBackDefaultState}
            signIn={signIn}
            closeModal={closeModal}
          />
        )}
        {state.current === STATE.signUp && (
          <SignUpForm
            phoneNumber={phoneNumber}
            socialAccount={state.socialAccount}
            handleBackDefaultState={handleBackDefaultState}
            signUp={signUp}
          />
        )}
      </LeftContent>
      <RightContent justifyContent="center" alignItems="center">
        <Image
          src={`${PATH_IMAGE.root}buy-more.png`}
          alt="buy_more"
          sx={{ width: '190px', height: '160px' }}
        />
        <Typography variant="subtitle2">Shopping at Tipe</Typography>
        <Typography variant="body2">Super deals every day</Typography>
      </RightContent>
    </RootStyle>
  );
};

const RootStyle = styled(Stack)({
  width: '800px',
  position: 'relative',
});

const CloseButton = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '5px',
  right: '5px',
  width: '30px',
  height: '30px',
  lineHeight: '30px',
  borderRadius: '15px',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    transition: '0.2s',
  },
}));

const LeftContent = styled(Stack)({
  width: STYLE.DESKTOP.AUTH_FORM.WIDTH,
  padding: '40px',
});

const RightContent = styled(Stack)(({ theme }) => ({
  width: `calc(100% - ${STYLE.DESKTOP.AUTH_FORM.WIDTH})`,
  background: `linear-gradient(136deg, rgb(255 164 140 / 11%), ${theme.palette.error.light})`,
  color: theme.palette.error.main,
}));

export default Authentication;

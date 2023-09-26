import _ from 'lodash';
import { useEffect, useReducer, createContext, ReactNode } from 'react';
import accountApi from '../apis/accountApi';
import { SignInBody, SignUpBody } from '@/models/interfaces/account';
import { getToken, isValidToken, setToken } from '@/utils';
import { useAppDispatch } from '@/redux/hooks';
import { initCustomer } from '@/redux/slices/customer.slice';
import { initCart } from '@/redux/slices/cart.slice';

interface AuthContextState {
  isInitialized: boolean;
  isAuthenticated: boolean;
}

interface AuthContextStateMethod {
  signIn: (signInBody: SignInBody) => Promise<string>;
  signUp: (signUpBody: SignUpBody) => Promise<void>;
  signOut: () => void;
}

const initialState: AuthContextState & AuthContextStateMethod = {
  isInitialized: false,
  isAuthenticated: false,
  signIn: () => Promise.resolve(''),
  signUp: () => Promise.resolve(),
  signOut: () => {},
};

const handlers = {
  INITIALIZE: (state: AuthContextState, action: AuthenticationAction) => {
    const { isAuthenticated } = action?.payload || {};
    return {
      ...state,
      isAuthenticated: _.isNil(isAuthenticated) ? state.isAuthenticated : isAuthenticated,
      isInitialized: true,
    };
  },
  LOGIN: (state: AuthContextState) => {
    return {
      ...state,
      isAuthenticated: true,
    };
  },
  LOGOUT: (state: AuthContextState) => {
    return {
      ...state,
      isAuthenticated: false,
    };
  },
};

interface AuthenticationAction {
  type: keyof typeof handlers;
  payload?: Partial<AuthContextState>;
}

const reducer = (state: AuthContextState, action: AuthenticationAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = getToken();
        const isAuthenticated = await isValidToken(token);
        if (isAuthenticated) {
          // Fetch necessary data here...
          appDispatch(initCustomer());
          appDispatch(initCart());
        }
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false },
        });
      }
    };
    initialize();
  }, []);

  const signIn = async (signInBody: SignInBody): Promise<string> => {
    const { name, accessToken } = await accountApi.signIn(signInBody);
    setToken(accessToken);
    // Fetch necessary data here...
    appDispatch(initCustomer());
    appDispatch(initCart());
    dispatch({ type: 'LOGIN' });
    return name;
  };

  const signUp = async (signUpBody: SignUpBody) => {
    await accountApi.signUp(signUpBody);
  };

  const signOut = () => {
    setToken(null);
    dispatch({
      type: 'LOGOUT',
    });
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

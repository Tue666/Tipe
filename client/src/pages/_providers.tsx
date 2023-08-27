import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';
import { SettingsProvider } from '@/contexts/Settings.context';
import { AxiosInterceptor } from '@/apis';
import { AuthProvider } from '@/contexts/Auth.context';

interface ProvidersProps {
  children: JSX.Element;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <SettingsProvider>
        <AuthProvider>
          <AxiosInterceptor>{children}</AxiosInterceptor>
        </AuthProvider>
      </SettingsProvider>
    </ReduxProvider>
  );
};

export default Providers;

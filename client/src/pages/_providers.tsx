import { Provider as ReduxProvider } from 'react-redux';
import { ConfirmProvider } from 'material-ui-confirm';
import { store } from '@/redux/store';
import { SettingsProvider } from '@/contexts/Settings.context';
import { AuthProvider } from '@/contexts/Auth.context';

interface ProvidersProps {
  children: JSX.Element;
}

const Providers = (props: ProvidersProps) => {
  const { children } = props;
  return (
    <ReduxProvider store={store}>
      <SettingsProvider>
        <ConfirmProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConfirmProvider>
      </SettingsProvider>
    </ReduxProvider>
  );
};

export default Providers;

import type { AppProps } from 'next/app';
import '@/theme/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Provider as ReduxProvider } from 'react-redux';
import { SettingsProvider } from '@/contexts/Settings.context';
import { store } from '@/redux/store';
import { AxiosInterceptor } from '@/apis';
import { AuthProvider } from '@/contexts/Auth.context';
import AppWrapper from './_app-wrapper';

const App = (props: AppProps) => {
  return (
    <ReduxProvider store={store}>
      <SettingsProvider>
        <AuthProvider>
          <AxiosInterceptor>
            <AppWrapper {...props} />
          </AxiosInterceptor>
        </AuthProvider>
      </SettingsProvider>
    </ReduxProvider>
  );
};

export default App;

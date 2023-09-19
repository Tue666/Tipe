import { ChangeEvent, createContext, ReactNode } from 'react';
import { PaletteMode } from '@mui/material';
import useLocalStorage from '@/hooks/useLocalStorage.hook';

interface SettingsContextState {
  themeMode: PaletteMode;
}
interface SettingsContextMethod {
  onChangeTheme: (currentMode: ChangeEvent<HTMLInputElement>) => void;
}

const initialState: SettingsContextState & SettingsContextMethod = {
  themeMode: 'light',
  onChangeTheme: () => {},
};

const SettingsContext = createContext(initialState);

interface SettingsProviderProps {
  children: ReactNode;
}

const SettingsProvider = (props: SettingsProviderProps) => {
  const { children } = props;
  const [settings, setSettings] = useLocalStorage<SettingsContextState>('settings', {
    themeMode: 'light',
  });

  const onChangeTheme = (e: ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: e.target.checked ? 'dark' : 'light',
    });
  };
  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onChangeTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };

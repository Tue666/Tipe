import { ChangeEvent, createContext, ReactNode } from "react";
import { PaletteMode } from "@mui/material";

// hooks
import useLocalStorage from "../hooks/useLocalStorage";

interface SettingsContextStates {
  themeMode: PaletteMode;
}
interface SettingsContextMethods {
  onChangeTheme: (currentMode: ChangeEvent<HTMLInputElement>) => void;
}

interface SettingsProviderProps {
  children: ReactNode;
}

const initalSettings: SettingsContextStates & SettingsContextMethods = {
  themeMode: "light",
  onChangeTheme: () => {},
};

const SettingsContext = createContext(initalSettings);

const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useLocalStorage<SettingsContextStates>(
    "settings",
    {
      themeMode: "light",
    }
  );

  const onChangeTheme = (e: ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: e.target.checked ? "dark" : "light",
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

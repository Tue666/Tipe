import { useContext } from 'react';
import { SettingsContext } from '@/contexts/Settings.context';

const useSettings = () => useContext(SettingsContext);

export default useSettings;

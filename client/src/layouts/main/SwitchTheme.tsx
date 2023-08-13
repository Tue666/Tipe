import { FormControlLabel, Switch } from '@mui/material';
import useSettings from '@/hooks/useSettings.hook';

const SwitchTheme = () => {
  const { themeMode, onChangeTheme } = useSettings();
  return (
    <FormControlLabel
      control={
        <Switch
          color="primary"
          size="small"
          checked={themeMode === 'dark'}
          onChange={onChangeTheme}
        />
      }
      label={themeMode === 'dark' ? <span>🌜</span> : <span>🌞</span>}
    />
  );
};

export default SwitchTheme;

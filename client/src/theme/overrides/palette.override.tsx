import type { ThemeOptions } from '@mui/material';

const PRIMARY = {
  lighter: '#FFA48D',
  light: '#FF867B',
  main: '#F53D2D',
  dark: '#D35449',
  darker: '#B72136',
  contrastText: '#FFF',
};

const SECONDARY = {
  lighter: '#8DD7F1',
  light: '#71C5E3',
  main: '#3FB7E4',
  dark: '#2CA4D0',
  darker: '#2591B8',
  contrastText: '#FFF',
};

const ERROR = {
  lighter: '#FFA48D',
  light: '#FF867B',
  main: '#F53D2D',
  dark: '#D35449',
  darker: '#B72136',
  contrastText: '#FFF',
};

const SUCCESS = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: '#00AB55',
  dark: '#007B55',
  darker: '#005249',
  contrastText: '#FFF',
};

const WARNING = {
  lighter: '#FFF1B1',
  light: '#FFE678',
  main: '#FDD836',
  dark: '#F6CF24',
  darker: '#DEB70D',
  contrastText: '#FFF',
};

const COMMON = {
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  error: { ...ERROR },
  success: { ...SUCCESS },
  warning: { ...WARNING },
};

interface PaletteProps {
  light: ThemeOptions['palette'];
  dark: ThemeOptions['palette'];
}

export const palette: PaletteProps = {
  light: {
    ...COMMON,
    background: { paper: '#FFF', default: '#F5F8FA' },
    mode: 'light',
  },
  dark: {
    ...COMMON,
    background: { paper: '#242424', default: '#312E2E' },
    mode: 'dark',
  },
};

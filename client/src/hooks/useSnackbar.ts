import { useSnackbar } from 'notistack';
import { SnackbarProps } from '@mui/material';

interface EnqueueOptions extends Partial<SnackbarProps> {
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
  autoHideDuration?: number;
  preventDuplicate?: boolean;
}

let snackbarRef: any;
const SnackbarUtilsConfiguration = () => {
  snackbarRef = useSnackbar();
  return null;
};

export const enqueueNotify = (msg: string, options: EnqueueOptions) => {
  snackbarRef.enqueueSnackbar(msg, options);
};

export default SnackbarUtilsConfiguration;

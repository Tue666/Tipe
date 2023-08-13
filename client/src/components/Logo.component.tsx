import { Stack, Typography, useTheme } from '@mui/material';
import { Link, Image } from './overrides';
import { PATH_IMAGE, PATH_MAIN } from '@/configs/routers';
import { STYLE } from '@/configs/constants';

interface LogoProps {
  title?: string;
}

const Logo = ({ title }: LogoProps) => {
  const theme = useTheme();
  return (
    <Link href={PATH_MAIN.home}>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Image
          src={`${PATH_IMAGE.root}logo.png`}
          alt="Tipe Logo"
          sx={{
            width: parseInt(STYLE.DESKTOP.LOGO.WIDTH),
            height: parseInt(STYLE.DESKTOP.LOGO.HEIGHT),
            [theme.breakpoints.down('md')]: {
              width: parseInt(STYLE.MOBILE.LOGO.WIDTH),
              height: parseInt(STYLE.MOBILE.LOGO.HEIGHT),
            },
          }}
        />
        <Typography variant="h6">{title || 'Tipe'}</Typography>
      </Stack>
    </Link>
  );
};

export default Logo;

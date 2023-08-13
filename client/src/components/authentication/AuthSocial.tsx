import { Stack, Divider, Typography, Link } from '@mui/material';

const AuthSocial = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <Divider sx={{ width: '100%' }}>Or continue by</Divider>
      <Typography variant="caption">
        By continuing, you accept the &nbsp;
        <Link href="https://www.facebook.com/exe.shiro" target="_blank">
          terms of use
        </Link>
      </Typography>
    </Stack>
  );
};

export default AuthSocial;

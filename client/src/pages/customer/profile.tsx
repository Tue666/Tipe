import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  AttachEmail,
  FacebookOutlined,
  MailOutline,
  PermPhoneMsgOutlined,
  SyncLockOutlined,
} from '@mui/icons-material';
import { Page } from '@/components';
import { DateOfBirth } from '@/components/customer';
import { PageWithLayout } from '../_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import { Avatar } from '@/components/overrides';
import { STYLE } from '@/configs/constants';

const SOCIAL = [
  {
    type: 'facebook',
    label: 'Facebook',
    icon: <FacebookOutlined color="primary" />,
  },
  {
    type: 'google',
    label: 'Google',
    icon: <AttachEmail color="error" />,
  },
];

const Profile: PageWithLayout = () => {
  return (
    <Page title="Customer information | Tipe">
      <Root direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Stack spacing={2} p={2} sx={{ flex: 1 }}>
          <Typography variant="subtitle2">Personal information</Typography>
          <Stack spacing={3}>
            <Avatar
              name="Tuệ (Customer)"
              src="/product-card-2.jpg"
              sx={{
                width: STYLE.DESKTOP.CUSTOMER.PROFILE.AVATAR_SIZE,
                height: STYLE.DESKTOP.CUSTOMER.PROFILE.AVATAR_SIZE,
                alignSelf: 'center',
              }}
            />
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Typography
                  variant="subtitle2"
                  sx={{ width: STYLE.DESKTOP.CUSTOMER.PROFILE.TITLE_SPACE }}
                >
                  Customer name
                </Typography>
                <TextField
                  label="Enter your name"
                  variant="outlined"
                  size="small"
                  color="secondary"
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Typography
                  variant="subtitle2"
                  sx={{ width: STYLE.DESKTOP.CUSTOMER.PROFILE.TITLE_SPACE }}
                >
                  Date of birth
                </Typography>
                <DateOfBirth />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Typography
                  variant="subtitle2"
                  sx={{ width: STYLE.DESKTOP.CUSTOMER.PROFILE.TITLE_SPACE }}
                >
                  Gender
                </Typography>
                <FormControl>
                  <RadioGroup row>
                    <FormControlLabel
                      value="female"
                      control={<Radio size="small" color="secondary" />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio size="small" color="secondary" />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio size="small" color="secondary" />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
              <LoadingButton loading={false} variant="contained" disableElevation>
                SAVE CHANGE
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
        {/* <Divider orientation="vertical" /> */}
        <Stack p={2} spacing={2} sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Phone number and Email</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PermPhoneMsgOutlined />
                <div>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'start' }}>
                    Phone number &nbsp;
                    <Typography
                      component="span"
                      variant="caption"
                      color="success.main"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Verified <i className="bi bi-check-circle" />
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                    0586181641
                  </Typography>
                </div>
              </Stack>
              <Button variant="outlined" size="small">
                UPDATE
              </Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <MailOutline />
                <div>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'start' }}>
                    Email &nbsp;
                    <Typography
                      component="span"
                      variant="caption"
                      color="success.main"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Verified <i className="bi bi-check-circle" />
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                    dapamu333@gmail.com
                  </Typography>
                  {/* {!email && <Typography variant="caption">Add email address</Typography>} */}
                </div>
              </Stack>
              <Button variant="outlined" size="small">
                UPDATE
              </Button>
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Security</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <SyncLockOutlined />
                <Typography component="span" variant="body2">
                  Change password
                </Typography>
              </Stack>
              <Button variant="outlined" size="small">
                UPDATE
              </Button>
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Social network link</Typography>
            {SOCIAL.map((item) => {
              const { type, label, icon } = item;
              const isLinked = true;
              return (
                <Stack
                  key={type}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {icon}
                    <Typography component="span" variant="body2">
                      {label}
                    </Typography>
                  </Stack>
                  <Button variant="outlined" size="small" disabled={isLinked} onClick={() => {}}>
                    {isLinked ? 'LINKED' : 'LINK'}
                  </Button>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Root>
    </Page>
  );
};

const Root = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
}));

Profile.getLayout = (page) => {
  return (
    <MainLayout>
      <CustomerLayout>{page}</CustomerLayout>
    </MainLayout>
  );
};

export default Profile;

import { Button, Divider, Stack, Typography, styled } from '@mui/material';
import { Link } from '../overrides';

const PriceStatistics = () => {
  return (
    <Root>
      <ContentInner>
        <Wrapper>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Ship Address</Typography>
            <Linking href="#">Change</Linking>
          </Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            VN | 0586181641
          </Typography>
          <Typography variant="body2">123, Ward 4, District 8, HCM City</Typography>
        </Wrapper>
        <Wrapper>
          <Typography variant="subtitle2">Tipe Promotion</Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', color: 'rgb(26 139 237)', cursor: 'pointer' }}
          >
            <i className="bi bi-ticket-detailed"></i> Select or enter another Promotion
          </Typography>
        </Wrapper>
        <Wrapper>
          {[...Array(5)].map((_, index) => {
            return (
              <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">123</Typography>
                <Typography variant="subtitle1">10.000.000</Typography>
              </Stack>
            );
          })}
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Total</Typography>
            <Stack alignItems="end">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                20.000.000
              </Typography>
              <Typography variant="caption">(VAT includes)</Typography>
            </Stack>
          </Stack>
        </Wrapper>
        <Button variant="contained" color="error" disableElevation sx={{ width: '100%' }}>
          Check out (10)
        </Button>
      </ContentInner>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  width: `calc(100% - calc(850px + 15px))`,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ContentInner = styled('div')(() => ({
  position: 'sticky',
  top: `calc(140px + 10px)`,
}));

const Wrapper = styled('div')(({ theme }) => ({
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: theme.palette.background.paper,
  fontSize: '14px',
}));

const Linking = styled(Link)({
  color: 'rgb(26 139 237)',
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: '500',
});

export default PriceStatistics;

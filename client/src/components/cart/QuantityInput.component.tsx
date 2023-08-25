import { styled, Stack, Box, Typography } from '@mui/material';

const QuantityInput = () => {
  const buttonStyle = {
    cursor: 'pointer',
    width: '30px',
    '&:hover': {
      border: '1px solid #2195F3',
    },
    '&.warning:hover': {
      border: '1px solid #F53D2D',
    },
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <BoxStyled className="warning" component="button" sx={buttonStyle}>
          -
        </BoxStyled>
        <BoxStyled component="input" sx={{ width: '40px' }} />
        <BoxStyled component="button" sx={buttonStyle}>
          +
        </BoxStyled>
      </Stack>
      {4 <= 5 && (
        <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
          4 product(s) left
        </Typography>
      )}
    </Stack>
  );
};

const BoxStyled = styled(Box)(({ theme }) => ({
  height: '30px',
  fontSize: '14px',
  textAlign: 'center',
  outline: 'none',
  transition: 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
  border: `1px solid ${theme.palette.background.default}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export default QuantityInput;

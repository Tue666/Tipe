import { CSSProperties } from 'react';
import { styled, Stack } from '@mui/material';

interface SearchBarProps {
  sx?: CSSProperties;
}

const SearchBar = ({ sx }: SearchBarProps) => {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
      <SearchField placeholder="Enter what are you looking for here ... <3" style={{ ...sx }} />
      <SearchButton>
        <i className="bi bi-search"></i>
      </SearchButton>
    </Stack>
  );
};

const SearchField = styled('input')(({ theme }) => ({
  width: '90%',
  height: '40px',
  padding: '20px',
  backgroundColor: theme.palette.background.default,
  outline: 'none',
  border: 'none',
  borderRadius: 20,
  '&:focus + div': {
    opacity: 1,
  },
}));

const SearchButton = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '5px',
  right: 'calc(10% + 5px)',
  width: '30px',
  height: '30px',
  lineHeight: '30px',
  outline: 'none',
  border: 'none',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  color: '#fff',
  transition: '0.4s',
  cursor: 'pointer',
  textAlign: 'center',
  opacity: 0,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'scale(1.1)',
  },
}));

export default SearchBar;

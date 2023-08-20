import { CSSProperties } from 'react';
import { styled, Stack } from '@mui/material';
import { STYLE } from '@/configs/constants';

const { SEARCH_HEIGH, SEARCH_PADDING, SEARCH_BUTTON_SIZE } = STYLE.DESKTOP.HEADER.SHORTCUTS;

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
  width: STYLE.DESKTOP.HEADER.SHORTCUTS.SEARCH_WIDTH,
  height: SEARCH_HEIGH,
  padding: `${SEARCH_PADDING} calc(${SEARCH_PADDING} + ${SEARCH_BUTTON_SIZE} + 10px) ${SEARCH_PADDING} ${SEARCH_PADDING}`,
  backgroundColor: theme.palette.background.default,
  outline: 'none',
  border: 'none',
  borderRadius: STYLE.DESKTOP.HEADER.SHORTCUTS.SEARCH_BORDER_RADIUS,
  '&:focus + div': {
    opacity: 1,
  },
}));

const SearchButton = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: `calc(${parseInt(SEARCH_HEIGH) / 2}px - ${parseInt(SEARCH_BUTTON_SIZE) / 2}px)`,
  right: `calc(${SEARCH_PADDING} + ${SEARCH_BUTTON_SIZE})`,
  width: STYLE.DESKTOP.HEADER.SHORTCUTS.SEARCH_BUTTON_SIZE,
  height: STYLE.DESKTOP.HEADER.SHORTCUTS.SEARCH_BUTTON_SIZE,
  lineHeight: STYLE.DESKTOP.HEADER.SHORTCUTS.SEARCH_BUTTON_SIZE,
  outline: 'none',
  border: 'none',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.background.paper,
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

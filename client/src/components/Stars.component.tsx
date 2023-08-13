import { Fragment } from 'react';
import { Stack, SxProps } from '@mui/material';
import { StarHalfRounded, StarRounded } from '@mui/icons-material';

interface StarsProps {
  total: number;
  rating: number;
  sx?: SxProps;
}

const Stars = ({ total, rating, sx }: StarsProps) => {
  return (
    <Stack direction="row" alignItems="center">
      {[...Array(total)].map((e, i) => (
        <Fragment key={i}>
          {i + 1 <= Math.floor(rating) ? (
            <StarRounded sx={{ color: 'warning.main', ...sx }} fontSize="small" />
          ) : i + 1 - rating >= 0.35 && i + 1 - rating <= 0.65 ? (
            <StarHalfRounded sx={{ color: 'warning.main', ...sx }} fontSize="small" />
          ) : (
            <StarRounded sx={{ color: 'rgb(199, 199, 199)', ...sx }} fontSize="small" />
          )}
        </Fragment>
      ))}
    </Stack>
  );
};

export default Stars;

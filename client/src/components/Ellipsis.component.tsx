import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

interface EllipsisProps extends TypographyProps {
  text: string;
  clamp?: number;
}

const Ellipsis = (props: EllipsisProps) => {
  const { text, clamp, sx, ...rest } = props;
  return (
    <Typography
      sx={{
        display: '-webkit-box',
        WebkitLineClamp: clamp || 2,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        ...sx,
      }}
      {...rest}
    >
      {text}
    </Typography>
  );
};

export default Ellipsis;

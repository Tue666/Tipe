import { default as NextImage } from 'next/image';
import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

interface ImageProps extends BoxProps {
  src: string;
  alt: string;
}

const Image = (props: ImageProps) => {
  const { src, alt, sx, ...rest } = props;
  return (
    <Box sx={{ position: 'relative', ...sx }} {...rest}>
      <NextImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </Box>
  );
};

export default Image;

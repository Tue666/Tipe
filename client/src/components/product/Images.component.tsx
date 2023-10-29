import { Fragment } from 'react';
import { Stack, Typography, styled } from '@mui/material';
import { Image } from '../overrides';
import { STYLE } from '@/configs/constants';
import { buildImageLink } from '@/utils';
import { IProduct } from '@/models/interfaces';

const MINI_IMAGE_NUMBER = 5;
const MINI_IMAGE_SPACING = 1;

interface ImagesProps extends Pick<IProduct.NestedProduct, 'images'> {}

const Images = (props: ImagesProps) => {
  const { images } = props;
  const miniImages = images.slice(0, MINI_IMAGE_NUMBER);
  return (
    <Fragment>
      <Root>
        <Image
          src={buildImageLink(images[0])}
          alt=""
          sx={{
            height: STYLE.DESKTOP.PRODUCT.IMAGE_HEIGHT,
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        />
        <Stack direction="row" spacing={MINI_IMAGE_SPACING}>
          {miniImages.map((image, index) => {
            const IMAGE_WIDTH = parseInt(STYLE.DESKTOP.PRODUCT.IMAGE_WIDTH);
            const MINI_IMAGE_SIZE = `${
              (IMAGE_WIDTH - MINI_IMAGE_NUMBER * (MINI_IMAGE_SPACING * (8 + 1))) / MINI_IMAGE_NUMBER
            }px`;
            return (
              <MiniImage key={index} className={index === 0 ? 'active' : ''}>
                <Image
                  src={buildImageLink(image)}
                  alt=""
                  sx={{
                    width: MINI_IMAGE_SIZE,
                    height: MINI_IMAGE_SIZE,
                  }}
                />
                {index === MINI_IMAGE_NUMBER - 1 && <ViewAllText>View all images</ViewAllText>}
              </MiniImage>
            );
          })}
        </Stack>
      </Root>
    </Fragment>
  );
};

const Root = styled('div')(({ theme }) => ({
  width: STYLE.DESKTOP.PRODUCT.IMAGE_WIDTH,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const MiniImage = styled('div')({
  position: 'relative',
  backgroundSize: '100% auto',
  border: '1px solid transparent',
  cursor: 'pointer',
  '&:not(:last-child):hover': {
    border: '1px solid gray',
  },
  '&:last-child': {
    textAlign: 'center',
  },
  '&.active': {
    border: '1px solid #f53d2d',
  },
});

const ViewAllText = styled(Typography)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  fontSize: '13px',
  fontWeight: 'bold',
  color: 'rgb(255, 255, 255)',
  top: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
});

export default Images;

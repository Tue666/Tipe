// import Image from "next/image";
import { Stack, Box, useTheme } from '@mui/material';
import { Carousel } from '../_external_/react-slick';
import { Image } from '../overrides';
import { STYLE } from '@/configs/constants';

interface BannersProps {
  id: string;
}

const Banners = ({ id }: BannersProps) => {
  const theme = useTheme();
  return (
    <Stack
      id={id}
      direction={{ xs: 'column', md: 'row' }}
      spacing={STYLE.DESKTOP.BANNERS.SPACING}
      sx={{
        [theme.breakpoints.up('md')]: {
          height: STYLE.DESKTOP.BANNERS.MAIN_HEIGHT,
        },
      }}
    >
      <Box
        sx={{
          width: STYLE.DESKTOP.BANNERS.MAIN_WIDTH,
          [theme.breakpoints.down('md')]: {
            width: STYLE.MOBILE.BANNERS.MAIN_WIDTH,
          },
        }}
      >
        <Carousel
          settings={{
            slidesToShow: STYLE.DESKTOP.BANNERS.SLIDE_TO_SHOW,
            slidesToScroll: STYLE.DESKTOP.BANNERS.SLIDE_TO_SCROLL,
            autoplay: STYLE.DESKTOP.BANNERS.AUTOPLAY,
            autoplaySpeed: STYLE.DESKTOP.BANNERS.AUTOPLAY_SPEED,
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Image
              key={index}
              src="https://cdn.123job.vn/123job//uploads/images/flash%20sale.jpg"
              alt=""
              sx={{
                height: STYLE.DESKTOP.BANNERS.MAIN_HEIGHT,
                [theme.breakpoints.down('md')]: {
                  height: STYLE.MOBILE.BANNERS.MAIN_HEIGHT,
                },
              }}
            />
          ))}
        </Carousel>
      </Box>
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        spacing={STYLE.DESKTOP.BANNERS.SPACING}
        sx={{ flex: 1 }}
      >
        <Image
          src="https://cdn.123job.vn/123job//uploads/images/flash%20sale.jpg"
          alt=""
          sx={{
            height: STYLE.DESKTOP.BANNERS.SUB_HEIGHT,
            [theme.breakpoints.down('md')]: {
              width: STYLE.MOBILE.BANNERS.SUB_WIDTH,
              height: STYLE.MOBILE.BANNERS.SUB_HEIGHT,
            },
          }}
        />
        <Image
          src="https://cdn.123job.vn/123job//uploads/images/flash%20sale.jpg"
          alt=""
          sx={{
            height: STYLE.DESKTOP.BANNERS.SUB_HEIGHT,
            [theme.breakpoints.down('md')]: {
              width: STYLE.MOBILE.BANNERS.SUB_WIDTH,
              height: STYLE.MOBILE.BANNERS.SUB_HEIGHT,
            },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Banners;

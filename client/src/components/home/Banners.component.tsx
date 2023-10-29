import { useRouter } from 'next/router';
import { Stack, Box, useTheme } from '@mui/material';
import { Carousel } from '../_external_/react-slick';
import { Image } from '../overrides';
import { STYLE } from '@/configs/constants';
import { PATH_MAIN } from '@/configs/routers';

interface Banner {
  src: string;
  alt: string;
  target_src: string;
}

const BANNERS: Banner[] = [
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-84b6dbb942b411b06e260b2534a52ab1',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-2131179d9a1f447ab57cf071281ff05e',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-809133920d280dbe21aa0da35856cd27',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-3f3306f3b0005a027b3e4aa9363bd158',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-751e3aaee689b67bf62dce69a4ce7423',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-c6cf7674a2d50b77e6f1f5276b201936',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-bd458cb7863667ff3fedc591191d3b2b',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-2e8f9f98d9a74f74ac4b690d9498c528',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-a7234d9499cfd616dc8ae50dd7aa13ad',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-ee3f3603e4a58268310ca2c01bf9bdfe',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-41887f4bf32b9c393c65382ac41552a6',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
];

const SUB_BANNERS: Banner[] = [
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-bb3bbd8e96e28c1fe53bfa5cdb720494',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
  {
    src: 'https://cf.shopee.vn/file/vn-50009109-66e02eaf7d1860a767bef0306f52d80a',
    alt: 'banner',
    target_src: PATH_MAIN.home,
  },
];

interface BannersProps {
  id: string;
}

const Banners = (props: BannersProps) => {
  const { id } = props;
  const { push } = useRouter();
  const theme = useTheme();

  const handleClickBanner = (targetSrc: Banner['target_src']) => {
    push(targetSrc);
  };
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
          {BANNERS?.length > 0 &&
            BANNERS.map((banner, index) => {
              const { src, alt, target_src } = banner;
              return (
                <Image
                  key={index}
                  src={src}
                  alt={alt}
                  sx={{
                    cursor: 'pointer',
                    height: STYLE.DESKTOP.BANNERS.MAIN_HEIGHT,
                    [theme.breakpoints.down('md')]: {
                      height: STYLE.MOBILE.BANNERS.MAIN_HEIGHT,
                    },
                  }}
                  onClick={() => handleClickBanner(target_src)}
                />
              );
            })}
        </Carousel>
      </Box>
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        spacing={STYLE.DESKTOP.BANNERS.SPACING}
        sx={{ flex: 1 }}
      >
        {SUB_BANNERS?.length > 0 &&
          SUB_BANNERS.map((banner, index) => {
            const { src, alt, target_src } = banner;
            return (
              <Image
                key={index}
                src={src}
                alt={alt}
                sx={{
                  cursor: 'pointer',
                  height: STYLE.DESKTOP.BANNERS.SUB_HEIGHT,
                  [theme.breakpoints.down('md')]: {
                    width: STYLE.MOBILE.BANNERS.SUB_WIDTH,
                    height: STYLE.MOBILE.BANNERS.SUB_HEIGHT,
                  },
                }}
                onClick={() => handleClickBanner(target_src)}
              />
            );
          })}
      </Stack>
    </Stack>
  );
};

export default Banners;

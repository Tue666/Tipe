import { styled, Grid, Stack, Tooltip, Typography, Skeleton } from '@mui/material';
import { Image, Link } from '../overrides';
import Ellipsis from '../Ellipsis.component';
import { STYLE } from '@/configs/constants';
import { ICategory } from '@/models/interfaces';
import { appConfig } from '@/configs/apis';
import { PATH_MAIN } from '@/configs/routers';

interface CategoriesProps {
  id: string;
  title: string;
  categories: ICategory.Category[];
}

const Categories = ({ id, title, categories }: CategoriesProps) => {
  return (
    <Root id={id}>
      <Stack spacing={1}>
        <Typography variant="subtitle2">{title}</Typography>
        <Grid container justifyContent="center">
          {categories?.length &&
            categories.map((category) => {
              const { _id, name, image, slug } = category;
              return (
                <Grid item lg={2} sm={3} xs={6} key={_id}>
                  <Link href={PATH_MAIN.category(slug, _id)}>
                    <Category direction="row" alignItems="center" spacing={2}>
                      <Image
                        src={`${appConfig.image_storage_url}/${image}`}
                        alt=""
                        sx={{
                          width: parseInt(STYLE.DESKTOP.CATEGORIES.ICON_SIZE),
                          height: parseInt(STYLE.DESKTOP.CATEGORIES.ICON_SIZE),
                          '& > img': {
                            borderRadius: STYLE.DESKTOP.CATEGORIES.ICON_BORDER_RADIUS,
                          },
                        }}
                      />
                      <Tooltip placement="top" title={name} arrow>
                        <div style={{ flex: 1 }}>
                          <Ellipsis
                            variant="body2"
                            text={name}
                            sx={{
                              '&:hover': {
                                color: (theme) => theme.palette.primary.main,
                              },
                            }}
                          />
                        </div>
                      </Tooltip>
                    </Category>
                  </Link>
                </Grid>
              );
            })}
          {!categories?.length &&
            [...Array(12)].map((_, index) => (
              <Grid item lg={2} sm={3} xs={6} key={index}>
                <Category>
                  <Skeleton variant="circular" width={49} height={49} />
                  <Skeleton variant="rectangular" width={80} height={45} />
                </Category>
              </Grid>
            ))}
        </Grid>
      </Stack>
    </Root>
  );
};

const Root = styled('div')(({ theme }) => ({
  background: `linear-gradient(180deg, ${theme.palette.background.paper}, transparent)`,
  borderRadius: STYLE.DESKTOP.CATEGORIES.BORDER_RADIUS,
  padding: STYLE.DESKTOP.CATEGORIES.PADDING,
}));

const Category = styled(Stack)(({ theme }) => ({
  padding: STYLE.DESKTOP.CATEGORIES.ITEM_PADDING,
  margin: STYLE.DESKTOP.CATEGORIES.ITEM_MARGIN,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: STYLE.DESKTOP.CATEGORIES.BORDER_RADIUS,
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '5px 3px 7px rgb(145 158 171 / 24%)',
  },
}));

export default Categories;

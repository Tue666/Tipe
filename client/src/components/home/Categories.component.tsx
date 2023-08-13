import { styled, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { Image } from '../overrides';
import Ellipsis from '../Ellipsis.component';
import { STYLE } from '@/configs/constants';

interface CategoriesProps {
  id: string;
  title: string;
}

const Categories = ({ id, title }: CategoriesProps) => {
  const theme = useTheme();
  return (
    <Root id={id}>
      <Stack spacing={1}>
        <Typography variant="subtitle2">{title}</Typography>
        <Grid container justifyContent="center">
          {[...Array(12)].map((_, index) => (
            <Grid item lg={2} sm={3} xs={6} key={index}>
              <Category direction="row" alignItems="center" spacing={2}>
                <Image
                  src="/product-card-2.jpg"
                  alt=""
                  sx={{
                    width: parseInt(STYLE.DESKTOP.CATEGORIES.ICON_SIZE),
                    height: parseInt(STYLE.DESKTOP.CATEGORIES.ICON_SIZE),
                    '& > img': {
                      borderRadius: STYLE.DESKTOP.CATEGORIES.ICON_BORDER_RADIUS,
                    },
                  }}
                />
                <Tooltip placement="top" title="hihi" arrow>
                  <div style={{ flex: 1 }}>
                    <Ellipsis
                      variant="body2"
                      text="Đời sống thể thao & Du lịch vui chơi"
                      sx={{
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </div>
                </Tooltip>
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

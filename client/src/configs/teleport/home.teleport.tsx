import { Ballot, Category, LocalFireDepartment, Favorite, ViewCarousel } from '@mui/icons-material';
import { TeleportProps, getIds, getTitles, getActions } from './teleport.config';

type Home = 'banners' | 'categories' | 'sold-section' | 'favorite-section' | 'product-list';
const homeTeleport: TeleportProps<Home>[] = [
  {
    id: 'banners',
    title: 'Banners',
    icon: <ViewCarousel />,
  },
  {
    id: 'categories',
    title: 'Categories',
    icon: <Category />,
  },
  {
    id: 'sold-section',
    title: 'Most selling products',
    icon: <LocalFireDepartment />,
  },
  {
    id: 'favorite-section',
    title: 'Maybe you like',
    icon: <Favorite />,
  },
  {
    id: 'product-list',
    title: 'Suggestions for you',
    icon: <Ballot />,
  },
];

export const HOME_TELEPORTS = {
  ids: getIds<Home>(homeTeleport),
  titles: getTitles<Home>(homeTeleport),
  actions: getActions<Home>(homeTeleport),
};

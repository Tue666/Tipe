import {
  Ballot,
  Category,
  LocalFireDepartment,
  ScreenSearchDesktop,
  ViewCarousel,
} from '@mui/icons-material';
import { TeleportProps, getIds, getTitles, getActions } from './teleport.config';

type Home = 'banners' | 'categories' | 'sold-section' | 'search-section' | 'product-list';
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
    id: 'search-section',
    title: 'Most searching products',
    icon: <ScreenSearchDesktop />,
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

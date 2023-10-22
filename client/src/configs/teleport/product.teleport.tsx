import {
  ImportContacts,
  FileCopy,
  Article,
  Description as DescriptionIcon,
  Star,
  More,
} from '@mui/icons-material';
import { TeleportProps, getIds, getTitles, getActions } from './teleport.config';

type Product =
  | 'information'
  | 'related-section'
  | 'specifications'
  | 'description'
  | 'review'
  | 'product-list';
const productTeleport: TeleportProps<Product>[] = [
  {
    id: 'information',
    title: 'Product information',
    icon: <ImportContacts />,
  },
  {
    id: 'related-section',
    title: 'Maybe you will be like',
    icon: <FileCopy />,
  },
  {
    id: 'specifications',
    title: 'Specifications',
    icon: <Article />,
  },
  {
    id: 'description',
    title: 'Product description',
    icon: <DescriptionIcon />,
  },
  {
    id: 'review',
    title: 'Ratings - Reviews from customers',
    icon: <Star />,
  },
  {
    id: 'product-list',
    title: 'Discover more for you',
    icon: <More />,
  },
];

export const PRODUCT_TELEPORTS = {
  ids: getIds<Product>(productTeleport),
  titles: getTitles<Product>(productTeleport),
  actions: getActions<Product>(productTeleport),
};

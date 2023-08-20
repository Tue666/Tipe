import { RouterUtil } from '@/utils';

const ROOT_MAIN = '/';
export const PATH_MAIN = {
  home: ROOT_MAIN,
  category: (slug: string, id: string) => {
    return RouterUtil.combinePath(ROOT_MAIN, `c/${slug}/${id}`);
  },
  cart: RouterUtil.combinePath(ROOT_MAIN, 'cart'),
};

const ROOT_CUSTOMER = '/customer';
export const PATH_CUSTOMER = {
  profile: RouterUtil.combinePath(ROOT_CUSTOMER, '/profile'),
};

const ROOT_IMAGE = '/';
export const PATH_IMAGE = {
  root: ROOT_IMAGE,
  social: RouterUtil.combinePath(ROOT_IMAGE, 'social'),
  download: RouterUtil.combinePath(ROOT_IMAGE, 'download'),
};

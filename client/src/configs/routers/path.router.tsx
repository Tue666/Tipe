import { RouterUtil } from '@/utils';

const ROOT_MAIN = '/';
export const PATH_MAIN = {
  home: ROOT_MAIN,
  category: (slug: string, _id: number) => {
    return RouterUtil.combinePath(ROOT_MAIN, `c/${slug}/${_id}`);
  },
  product: (slug: string, _id: string) => {
    return RouterUtil.combinePath(ROOT_MAIN, `p/${slug}/${_id}`);
  },
  cart: RouterUtil.combinePath(ROOT_MAIN, 'cart'),
  news: RouterUtil.combinePath(ROOT_MAIN, 'news'),
};

const ROOT_CUSTOMER = '/customer';
export const PATH_CUSTOMER = {
  profile: RouterUtil.combinePath(ROOT_CUSTOMER, '/profile'),
  addresses: RouterUtil.combinePath(ROOT_CUSTOMER, '/addresses'),
  addressForm: RouterUtil.combinePath(ROOT_CUSTOMER, '/addresses/form'),
  orders: RouterUtil.combinePath(ROOT_CUSTOMER, '/orders'),
  order: (_id: string) => {
    return RouterUtil.combinePath(ROOT_CUSTOMER, `/orders/${_id}`);
  },
};

const ROOT_CHECKOUT = '/checkout';
export const PATH_CHECKOUT = {
  shipping: RouterUtil.combinePath(ROOT_CHECKOUT, '/shipping'),
  payment: RouterUtil.combinePath(ROOT_CHECKOUT, '/payment'),
  result: RouterUtil.combinePath(ROOT_CHECKOUT, '/result'),
};

const ROOT_IMAGE = '/';
export const PATH_IMAGE = {
  root: ROOT_IMAGE,
  icons: RouterUtil.combinePath(ROOT_IMAGE, 'icons'),
};

const path = (root: string, sublink: string): string => {
  return `${root}${sublink}`;
};

const ROOT_MAIN = "/";

export const PATH_MAIN = {
  home: ROOT_MAIN,
  cart: path(ROOT_MAIN, "cart"),
};

const ROOT_IMAGE = "/";

export const PATH_IMAGE = {
  root: ROOT_IMAGE,
  social: path(ROOT_IMAGE, "social"),
  download: path(ROOT_IMAGE, "download"),
};

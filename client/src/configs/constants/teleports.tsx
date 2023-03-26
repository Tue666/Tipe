import { ReactNode } from "react";
import {
  Ballot,
  Category,
  LocalFireDepartment,
  ScreenSearchDesktop,
  ViewCarousel,
} from "@mui/icons-material";

// components
import { combineLink } from "@/components/ScrollToTop";

interface TeleportsProps<T> {
  id: T;
  title: string;
  icon: ReactNode;
}

type Ids<T extends string> = {
  [K in T]: K;
};

type Titles<T extends string> = {
  [K in T]: TeleportsProps<K>["title"];
};

const getIds = <T extends string>(teleports: TeleportsProps<T>[]): Ids<T> => {
  return teleports.reduce((ids, teleport) => {
    const { id } = teleport;
    if (!id) return { ...ids };
    return { ...ids, [id]: id };
  }, {} as Ids<T>);
};

const getTitles = <T extends string>(
  teleports: TeleportsProps<T>[]
): Titles<T> => {
  return teleports.reduce((titles, teleport) => {
    const { id, title } = teleport;
    if (!id) return { ...titles };
    return { ...titles, [id]: title };
  }, {} as Titles<T>);
};

const getActions = <T extends string>(teleports: TeleportsProps<T>[]) => {
  return teleports.map((teleports) => {
    const { id, title, icon } = teleports;
    return { title, icon: combineLink(id, icon) };
  });
};

type Home =
  | "banners"
  | "categories"
  | "sold-section"
  | "search-section"
  | "product-list";

const homeTeleports: TeleportsProps<Home>[] = [
  {
    id: "banners",
    title: "Banners",
    icon: <ViewCarousel />,
  },
  {
    id: "categories",
    title: "Categories",
    icon: <Category />,
  },
  {
    id: "sold-section",
    title: "Most selling products",
    icon: <LocalFireDepartment />,
  },
  {
    id: "search-section",
    title: "Most searching products",
    icon: <ScreenSearchDesktop />,
  },
  {
    id: "product-list",
    title: "Suggestions for you",
    icon: <Ballot />,
  },
];

export const HOME_TELEPORTS = {
  ids: getIds<Home>(homeTeleports),
  titles: getTitles<Home>(homeTeleports),
  actions: getActions<Home>(homeTeleports),
};

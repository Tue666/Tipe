import { combineLink } from '@/components';

export interface TeleportProps<T> {
  id: T;
  title: string;
  icon: any;
}

export type Ids<T extends string> = {
  [K in T]: K;
};

export type Titles<T extends string> = {
  [K in T]: TeleportProps<K>['title'];
};

export const getIds = <T extends string>(teleport: TeleportProps<T>[]): Ids<T> => {
  return teleport.reduce((ids, port) => {
    const { id } = port;
    if (!id) return { ...ids };
    return { ...ids, [id]: id };
  }, {} as Ids<T>);
};

export const getTitles = <T extends string>(teleport: TeleportProps<T>[]): Titles<T> => {
  return teleport.reduce((titles, port) => {
    const { id, title } = port;
    if (!id) return { ...titles };
    return { ...titles, [id]: title };
  }, {} as Titles<T>);
};

export const getActions = <T extends string>(teleport: TeleportProps<T>[]) => {
  return teleport.map((port) => {
    const { id, title, icon } = port;
    return {
      title,
      icon: combineLink({
        to: id,
        children: icon,
      }),
    };
  });
};

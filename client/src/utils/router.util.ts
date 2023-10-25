import _ from 'lodash';
import { ParsedUrlQuery } from 'querystring';

export class RouterUtil {
  public static combinePath(root: string, subLink: string): string {
    return `${root}${subLink}`;
  }

  public static buildUrlQueryObject(
    key: string,
    value: string,
    isMultiple: boolean = false,
    queries: ParsedUrlQuery = {}
  ): ParsedUrlQuery {
    if (_.isNil(queries[key])) {
      queries[key] = isMultiple ? [value] : value;
    } else {
      const hasValue = queries[key]!.indexOf(value) !== -1;
      if (isMultiple) {
        if (hasValue) {
          queries[key] = (queries[key] as string[])!.filter((v) => v !== value);
          if (queries[key]?.length! <= 0) delete queries[key];
        } else {
          queries[key] = [...(queries[key] as string[]), value];
        }
      } else {
        if (hasValue) {
          delete queries[key];
        } else {
          queries[key] = value;
        }
      }
    }
    return queries;
  }
}

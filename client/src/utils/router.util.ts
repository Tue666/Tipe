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
    resetPage: boolean = false,
    queries: ParsedUrlQuery = {}
  ): ParsedUrlQuery {
    if (resetPage) delete queries['newest'];

    if (_.isNil(queries[key])) {
      queries[key] = value;
      return queries;
    }

    const hasValue = queries[key]!.indexOf(value) !== -1;
    if (isMultiple) {
      if (!Array.isArray(queries[key])) queries[key] = [queries[key] as string];
      if (hasValue) {
        queries[key] = (queries[key] as string[]).filter((v) => v !== value);
        if ((queries[key] as string[]).length <= 0) delete queries[key];
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
    return queries;
  }
}

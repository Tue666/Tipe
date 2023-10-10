import _ from 'lodash';

export class RouterUtil {
  public static combinePath(root: string, subLink: string): string {
    return `${root}${subLink}`;
  }

  public static buildUrlQueryParams(queryObj: any, ignoreEmpty: boolean = true): string {
    let url = '';
    if (_.isNil(queryObj)) return url;

    for (const key in queryObj) {
      if (ignoreEmpty && (_.isNil(queryObj[key]) || queryObj[key] === '')) {
        continue;
      }

      if (url !== '') {
        url += '&';
      }
      url += key + '=' + encodeURIComponent(queryObj[key]);
    }
    return url;
  }
}

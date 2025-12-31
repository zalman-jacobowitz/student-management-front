import { usePathname } from './use-pathname';
import { hasParams, removeParams, isExternalLink, removeLastSlash } from '../utils';

// ----------------------------------------------------------------------

export function useActiveLink(itemPath, deep = true) {
  const pathname = removeLastSlash(usePathname());
  
  // Normalize URLs to handle encoded Hebrew/international characters
  const normalizeUrl = (url) => {
    try {
      return decodeURIComponent(url);
    } catch {
      return url;
    }
  };

  const normalizedPathname = normalizeUrl(pathname);
  const normalizedItemPath = normalizeUrl(itemPath);
  
  const pathHasParams = hasParams(normalizedItemPath);

  /* Start check */
  const notValid = normalizedItemPath.startsWith('#') || isExternalLink(normalizedItemPath);

  if (notValid) {
    return false;
  }
  /* End check */

  /**
   * [1] Apply for Item has children or has params.
   */
  const isDeep = deep || pathHasParams;

  // console.info(isDeep ? '[deep]   :' : '[normal] :', normalizedItemPath, '-?-', normalizedPathname);

  if (isDeep) {
    /**
     * [1] Deep: default
     * @itemPath 			 = '/dashboard/user'
     * @match pathname = '/dashboard/user'
     * @match pathname = '/dashboard/user/list'
     * @match pathname = '/dashboard/user/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b15/edit'
     */
    const defaultActive = normalizedPathname.includes(normalizedItemPath);

    /**
     * [1] Deep: has params
     * @itemPath 			 = '/dashboard/test?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'
     * @match pathname = '/dashboard/test'
     */

    const originItemPath = removeParams(normalizedItemPath);

    const hasParamsActive = pathHasParams && originItemPath === normalizedPathname;

    return defaultActive || hasParamsActive;
  }

  /**
   * [1] Normal: active
   * @itemPath 			 = '/dashboard/calendar'
   * @match pathname = '/dashboard/calendar'
   */
  return normalizedPathname === normalizedItemPath;
}

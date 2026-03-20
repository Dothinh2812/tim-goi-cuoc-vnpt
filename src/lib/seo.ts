import { getSiteUrl } from '../config/site';

export function shouldNoIndex() {
  return !getSiteUrl();
}

export function toAbsoluteUrl(pathname: string) {
  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    return '';
  }

  return new URL(pathname, `${siteUrl}/`).toString();
}

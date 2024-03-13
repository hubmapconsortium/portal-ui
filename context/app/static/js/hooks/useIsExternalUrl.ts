import { useMemo } from 'react';

/**
 * Creates and removes a temporary `a` tag to check if a URL is external to the current site
 *
 * @see https://www.designcise.com/web/tutorial/how-to-check-if-a-string-url-refers-to-an-external-link-using-javascript
 * @param url
 * @returns true if the URL is external, false otherwise
 */
function isExternalURL(url: string) {
  const tmpLink = document.createElement('a');
  tmpLink.href = url;
  const tmpLinkHost = tmpLink.host;
  const windowHost = window.location.host;
  tmpLink.remove();
  return tmpLinkHost !== windowHost;
}

/**
 * Custom hook to check if a URL is external to the current site
 *
 * @param href
 * @returns true if the URL is external, false otherwise
 */
export function useIsExternalUrl(href: string) {
  return useMemo(() => isExternalURL(href), [href]);
}

const outboundProps = {
  rel: 'noopener noreferrer',
  target: '_blank',
} as const;

export function useExternalUrlProps(href: string) {
  const isExternal = useIsExternalUrl(href);
  return isExternal ? outboundProps : {};
}

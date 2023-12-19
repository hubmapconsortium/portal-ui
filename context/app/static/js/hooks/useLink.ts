import { useEffect } from 'react';

/**
 * Reusable hook to dynamically add a link tag to the dom
 * @param href - url of the link to add
 * @param rel - rel attribute of the link, defaults to 'stylesheet'
 */
export default function useLink(href: string, rel = 'stylesheet', type = 'text/css') {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = rel;
    link.type = type;
    link.href = href;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [href, rel, type]);
}

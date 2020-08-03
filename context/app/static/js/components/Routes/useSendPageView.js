import { useEffect } from 'react';
import ReactGA from 'react-ga';

export function useSendPageView(path) {
  useEffect(() => {
    if (path.startsWith('/browse')) {
      const pathWithoutUUID = path.match(/\/\w+\/\w+/)[0];
      ReactGA.pageview(pathWithoutUUID);
      return;
    }
    if (path.startsWith('/search') || path.startsWith('/dev-search')) {
      const urlParams = new URLSearchParams(window.location.search);
      const entityTypeKey = 'entity_type[0]';
      ReactGA.pageview(`${path}?${entityTypeKey}=${urlParams.get(entityTypeKey)}`);
      return;
    }
    ReactGA.pageview(path);
  }, [path]);
}

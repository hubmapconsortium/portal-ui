import { useEffect } from 'react';
import ReactGA from 'react-ga';

function useSendPageView(path) {
  useEffect(() => {
    if (path.startsWith('/browse')) {
      const pathWithoutUUID = path.match(/\/browse\/\w+/)[0];
      ReactGA.pageview(pathWithoutUUID);
      return;
    }
    // send path without ID for specific saved list page
    if (path.match(/\/my-lists\/[\w-]+/)) {
      ReactGA.pageview('/my-lists/saved-list');
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

export default useSendPageView;

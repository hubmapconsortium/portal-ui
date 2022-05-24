import { useEffect } from 'react';
import { trackPageView } from 'js/helpers/trackers';

function useSendPageView(path) {
  useEffect(() => {
    if (path.startsWith('/browse')) {
      const trackPath = path.match(/\/browse\/\w+/)[0];
      trackPageView(trackPath);
      return;
    }
    // send path without ID for specific saved list page
    if (path.startsWith('/my-lists/')) {
      // Distinguished by final slash.
      const trackPath = '/my-lists/saved-list';
      trackPageView(trackPath);
      return;
    }
    if (path.startsWith('/search') || path.startsWith('/dev-search')) {
      const urlParams = new URLSearchParams(window.location.search);
      const entityTypeKey = 'entity_type[0]';
      const trackPath = `${path}?${entityTypeKey}=${urlParams.get(entityTypeKey)}`;
      trackPageView(trackPath);
      return;
    }
    trackPageView(path);
  }, [path]);
}

export default useSendPageView;

import { useEffect } from 'react';
import { trackPageView } from 'js/helpers/trackers';

function getOldEntityTypeParam(type) {
  switch (type) {
    case 'donors':
      return 'Donor';
    case 'samples':
      return 'Sample';
    case 'datasets':
      return 'Dataset';
    default:
      return '';
  }
}

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
      const entityTypeKey = 'entity_type[0]';
      const type = path.split('/').pop();
      const trackPath = `${path}?${entityTypeKey}=${getOldEntityTypeParam(type)}`;
      trackPageView(trackPath);
      return;
    }
    trackPageView(path);
  }, [path]);
}

export default useSendPageView;

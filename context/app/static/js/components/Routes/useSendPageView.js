import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useMatomo } from '@datapunt/matomo-tracker-react';

function useSendPageView(path) {
  const { trackPageView } = useMatomo();

  useEffect(() => {
    if (path.startsWith('/browse')) {
      const trackPath = path.match(/\/browse\/\w+/)[0];
      ReactGA.pageview(trackPath);
      trackPageView({ href: trackPath });
      return;
    }
    // send path without ID for specific saved list page
    if (path.startsWith('/my-lists/')) {
      // Distinguished by final slash.
      const trackPath = '/my-lists/saved-list';
      ReactGA.pageview(trackPath);
      trackPageView({ href: trackPath });
      return;
    }
    if (path.startsWith('/search') || path.startsWith('/dev-search')) {
      const urlParams = new URLSearchParams(window.location.search);
      const entityTypeKey = 'entity_type[0]';
      const trackPath = `${path}?${entityTypeKey}=${urlParams.get(entityTypeKey)}`;
      ReactGA.pageview(trackPath);
      trackPageView({ href: trackPath });
      return;
    }
    ReactGA.pageview(path);
    trackPageView({ href: path });
  }, [path, trackPageView]);
}

export default useSendPageView;

import MatomoTracker from '@datapunt/matomo-tracker-js';
import ReactGA from 'react-ga4';
import { readCookie } from 'js/helpers/functions';

function getSiteId(location) {
  const { host } = location;

  // siteIds should correspond to the list at:
  // https://hubmap.matomo.cloud/index.php?module=SitesManager

  switch (host) {
    case 'portal.hubmapconsortium.org':
      return 1;
    case 'localhost:5001':
      return 2;
    default:
      return 3;
  }
}

function getUserType() {
  // Set in routes_auth.py:
  return readCookie('last_login') ? 'internal' : 'external';
}

const tracker = new MatomoTracker({
  urlBase: 'https://hubmap.matomo.cloud/',
  // eslint-disable-next-line no-restricted-globals
  siteId: getSiteId(location),
  // userId: 'UID76903202', // optional, default value: `undefined`.
  // trackerUrl: 'https://hubmap.matomo.cloud/tracking.php', // optional, default value: `${urlBase}matomo.php`
  // srcUrl: 'https://hubmap.matomo.cloud/tracking.js', // optional, default value: `${urlBase}matomo.js`
  disabled: process.env.NODE_ENV === 'test', // Tracking calls should be no-ops during tests.
  // heartBeat: { // optional, enabled by default
  //   active: true, // optional, default value: true
  //   seconds: 10 // optional, default value: `15
  // },
  // linkTracking: false, // optional, default value: true
  // configurations: { // optional, default value: {}
  //   // any valid matomo configuration, all below are optional
  //   disableCookies: true,
  //   setSecureCookie: true,
  //   setRequestMethod: 'POST'
  // }
  configurations: { setCustomDimension: [1 /* user_type */, getUserType()] },
});

ReactGA.initialize('G-Q1QJYZHM1D', {
  testMode: process.env.NODE_ENV === 'test', // Disables calls to GA during testing.
  gaOptions: {
    debug_mode: process.env.NODE_ENV === 'development', // Sends calls to GA in debug mode while developing locally.
  },
});

function trackPageView(path) {
  tracker.trackPageView({ href: path });
  ReactGA.send({ hitType: 'pageview', page: path });
}

function trackEvent(event) {
  tracker.trackEvent(event);
  ReactGA.event(event);
}

function trackLink(href, type) {
  tracker.trackLink({
    href,
    linkType: type || 'link',
  });
  ReactGA.event({
    category: type || 'Outbound Link',
    action: 'Clicked',
    label: href,
    nonInteraction: false,
  });
}

function trackSiteSearch(keyword) {
  tracker.trackSiteSearch({
    keyword,
  });
  /*
  We currently call both trackEvent and trackSiteSearch:
  while that is the case, we don't have to double track the even in GA.
  
  ReactGA.event({
    // category: analyticsCategory,
    action: 'Free Text Search',
    label: keyword,
  });
  */
}

export { trackPageView, trackEvent, trackLink, trackSiteSearch };

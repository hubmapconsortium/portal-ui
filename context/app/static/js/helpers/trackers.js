import MatomoTracker from '@datapunt/matomo-tracker-js';
import ReactGA from 'react-ga';

function getSiteId(location) {
  const { host } = location;

  // siteIds should correspond to the list at:
  // https://hubmap.matomo.cloud/index.php?module=SitesManager

  switch (host) {
    case 'portal.hubmap.org':
      return 1;
    case 'localhost:5001':
      return 2;
    default:
      return 3;
  }
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
});

ReactGA.initialize('UA-133341631-3', { testMode: process.env.NODE_ENV === 'test' });

function trackPageView(path) {
  tracker.trackPageView({ href: path });
  ReactGA.pageview(path);
}

function trackEvent(event) {
  tracker.trackEvent(event);
  ReactGA.event(event);
}

// function trackLink(href) {
//   tracker.trackLink({
//     href: 'https://link-to-other-website.org',
//   })
// }

// function trackSiteSearch(keyword) {
//   tracker.trackLink({
//     keyword: 'test',
//   })
// }

export { trackPageView, trackEvent };

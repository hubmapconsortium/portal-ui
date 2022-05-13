import MatomoTracker from '@datapunt/matomo-tracker-js';

function getSiteId(location) {
  const { host } = location;

  // siteIds should correspond to the list at:
  // https://hubmapconsortium.matomo.cloud/index.php?module=SitesManager

  switch (host) {
    case 'portal.hubmapconsortium.org':
      return 1;
    case 'localhost:5001':
      return 2;
    default:
      return 3;
  }
}

const tracker = new MatomoTracker({
  urlBase: 'https://hubmapconsortium.matomo.cloud/',
  // eslint-disable-next-line no-restricted-globals
  siteId: getSiteId(location),
  // userId: 'UID76903202', // optional, default value: `undefined`.
  // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
  // srcUrl: 'https://LINK.TO.DOMAIN/tracking.js', // optional, default value: `${urlBase}matomo.js`
  // disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
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

function trackPageView(path) {
  tracker.trackPageView({ href: path });
}

function trackEvent(event) {
  tracker.trackEvent(event);
}

function trackLink(href) {
  tracker.trackLink({
    href,
  });
}

function trackSiteSearch(keyword) {
  tracker.trackSiteSearch({
    keyword,
  });
}

export { trackPageView, trackEvent, trackLink, trackSiteSearch };

import MatomoTracker from '@datapunt/matomo-tracker-js';
import ReactGA from 'react-ga4';
import { faro } from '@grafana/faro-web-sdk';
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

export function getUserType() {
  // `last_login` cookie is only set when internal users log in.
  // Default to `external` if the cookie is not set.
  return readCookie('last_login') ? 'internal' : 'external';
}

export function getUserGroups() {
  // Reads the user's groups from the cookie set in `routes_auth.py`.
  // Default to `none` if the cookie is not set.
  return readCookie('user_groups') || 'none';
}

/**
 * Read cookies set in `routes_auth.py` to determine user type and groups.
 * @returns {Array} An array of custom dimensions matching the configuration in Matomo
 */
function getCustomDimensions() {
  const userType = getUserType();
  const userGroups = getUserGroups();
  return [
    [1 /* user_type */, userType],
    [2 /* user_groups */, userGroups],
  ];
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
  configurations: {
    setCustomDimension: getCustomDimensions(),
  },
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
  faro.api.pushEvent('pageview', { path });
}

const stringifyEventValues = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, `${JSON.stringify(value)}`]));

function buildLabelFields(event, id) {
  const { label } = event;

  if (!id) {
    return {};
  }

  const wrappedID = `<${id}>`;

  if (!label) {
    return { label: wrappedID, name: wrappedID };
  }

  const labelWithID = `${wrappedID} ${label}`;
  return { label: labelWithID, name: labelWithID };
}

function trackEvent(event, id) {
  // Convert all event values to strings to avoid errors in faro and matomo.
  // https://github.com/grafana/faro-web-sdk/issues/269
  const safeEvent = stringifyEventValues({ ...event, ...buildLabelFields(event, id) });
  tracker.trackEvent(safeEvent);
  ReactGA.event(safeEvent);
  const category = safeEvent.category.replace(/ /g, '_');
  faro.api.pushEvent(category, safeEvent);
}

function trackMeasurement(type, values, context = undefined) {
  faro.api.pushMeasurement({ type, values, context: context ? stringifyEventValues(context) : undefined });
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
  faro.api.pushEvent(type || 'Outbound Link Clicked', { href });
}

function trackSiteSearch(keyword) {
  tracker.trackSiteSearch({
    keyword,
  });
  /*
  We currently call both trackEvent and trackSiteSearch:
  while that is the case, we don't have to double track the event in GA/faro.
  
  ReactGA.event({
    // category: analyticsCategory,
    action: 'Free Text Search',
    label: keyword,
  });
  faro.api.pushEvent('Free Text Search', { keyword });
  */
}

export { trackPageView, trackEvent, trackMeasurement, trackLink, trackSiteSearch };

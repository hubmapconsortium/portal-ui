import MatomoTracker from '@datapunt/matomo-tracker-js';
import ReactGA from 'react-ga4';
import { faro } from '@grafana/faro-web-sdk';
import { readCookie } from 'js/helpers/functions';

// Flexible event type that matches actual usage across the codebase.
// Callers pass arbitrary key-value pairs; stringifyEventValues normalizes them.
interface TrackingEvent {
  category?: string;
  action?: unknown;
  label?: unknown;
  value?: unknown;
  [key: string]: unknown;
}

function getSiteId(loc: Location) {
  const { host } = loc;

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
 * @returns An array of custom dimensions matching the configuration in Matomo
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

function trackPageView(path: string) {
  tracker.trackPageView({ href: path });
  ReactGA.send({ hitType: 'pageview', page: path });
  faro.api.pushEvent('pageview', { path });
}

type StringifiedEvent = Record<string, string | number>;

const stringifyEventValues = (obj: Record<string, unknown>): StringifiedEvent =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === 'string' || typeof value === 'number' ? value : `${JSON.stringify(value)}`,
    ]),
  ) as StringifiedEvent;

function prependIDToLabel(event: StringifiedEvent, id?: string): string | number | undefined {
  const { label } = event;

  if (!id) {
    return label;
  }

  const wrappedID = `<${id}>`;

  if (!label) {
    return wrappedID;
  }

  return `${wrappedID} ${label}`;
}

function buildLabelFields(event: StringifiedEvent, id?: string): Partial<Pick<StringifiedEvent, 'label' | 'name'>> {
  const label = prependIDToLabel(event, id);
  return label !== undefined ? { label, name: label } : {};
}

function formatEvent(event: TrackingEvent, id?: string): StringifiedEvent {
  // Convert all event values to strings to avoid errors in faro and matomo.
  // https://github.com/grafana/faro-web-sdk/issues/269
  const safeEvent = stringifyEventValues(event as Record<string, unknown>);
  return { ...safeEvent, ...buildLabelFields(safeEvent, id) };
}

function trackEvent(event: TrackingEvent, id?: string, matomo = true) {
  const formattedEvent = formatEvent(event, id);
  if (matomo) tracker.trackEvent(formattedEvent as unknown as Parameters<typeof tracker.trackEvent>[0]);
  ReactGA.event(formattedEvent as unknown as Parameters<typeof ReactGA.event>[0]);
  const category = String(formattedEvent.category).replace(/ /g, '_');
  faro.api.pushEvent(category, formattedEvent as Record<string, string>);
}

function trackMeasurement(type: string, values: Record<string, number>, context?: Record<string, unknown>) {
  faro.api.pushMeasurement({
    type,
    values,
    context: context ? (stringifyEventValues(context) as Record<string, string>) : undefined,
  });
}

function trackLink(href: string, type?: string) {
  tracker.trackLink({
    href,
    linkType: (type || 'link') as 'link' | 'download',
  });
  ReactGA.event({
    category: type || 'Outbound Link',
    action: 'Clicked',
    label: href,
    nonInteraction: false,
  });
  faro.api.pushEvent(type || 'Outbound Link Clicked', { href });
}

function trackSiteSearch(keyword: string, category?: string) {
  tracker.trackSiteSearch({
    keyword,
    category,
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

export { trackPageView, formatEvent, trackEvent, trackMeasurement, trackLink, trackSiteSearch };

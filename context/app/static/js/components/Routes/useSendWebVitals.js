import { useEffect } from 'react';
import { trackEvent } from 'js/helpers/trackers';
import { getCLS, getFID, getLCP, getTTFB } from 'web-vitals';

// copy-and-paste from https://github.com/GoogleChrome/web-vitals#using-analyticsjs
function sendVitalsToGA({ name, delta, id }) {
  trackEvent({
    category: 'Web Vitals',
    action: name === 'CLS' ? 'CLS * 1000' : name,
    // From web-vitals: The `id` value will be unique to the current page load. When sending
    // multiple values from the same page (e.g. for CLS), Google Analytics can
    // compute a total by grouping on this ID (note: requires `eventLabel` to
    // be a dimension in your report).
    label: id,
    // From web-vitals: Google Analytics metrics must be integers, so the value is rounded.
    // For CLS the value is first multiplied by 1000 for greater precision
    // (note: increase the multiplier for greater precision if needed).
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    nonInteraction: true,
  });
}

function useSendWebVitals() {
  useEffect(() => {
    getTTFB(sendVitalsToGA);
    getCLS(sendVitalsToGA);
    getFID(sendVitalsToGA);
    getLCP(sendVitalsToGA);
  }, []);
}

export default useSendWebVitals;

import { encodeConfInUrl } from 'vitessce';
import { DEFAULT_LONG_URL_WARNING, DEFAULT_EMAIL_MESSAGE } from './constants';

interface GetUrlOptions {
  vizHubmapId?: string;
  fullscreen?: boolean;
}

const getUrl = (conf: object, onOverMaximumUrlLength: () => void, options?: GetUrlOptions) => {
  // Build from origin+pathname only to avoid retaining stale query params (e.g., ?viz= or ?fullscreen=)
  // from the current URL when sharing a different visualization.
  const cleanUrl = new URL(window.location.pathname, window.location.origin);
  if (options?.vizHubmapId) {
    cleanUrl.searchParams.set('viz', options.vizHubmapId.toLowerCase());
  }
  if (options?.fullscreen) {
    cleanUrl.searchParams.set('fullscreen', 'true');
  }
  const baseUrl = cleanUrl.toString();
  const fragment = encodeConfInUrl({
    conf,
    onOverMaximumUrlLength,
  });
  const url = `${baseUrl}#${fragment}`;
  return url;
};

const copyToClipBoard = (conf: object, onOverMaximumUrlLength: () => void, options?: GetUrlOptions) => {
  const url = getUrl(conf, onOverMaximumUrlLength, options);

  navigator.clipboard
    .writeText(url)
    .then()
    .catch((err) => {
      console.error('Failed to copy text to clipboard: ', err);
    });
};

const createEmailWithUrl = (conf: object, options?: GetUrlOptions) => {
  let longUrlWarning = '';
  const onOverMaximumUrlLength = () => {
    longUrlWarning = DEFAULT_LONG_URL_WARNING;
  };
  const url = getUrl(conf, onOverMaximumUrlLength, options);
  // We need to encode the URL so its parameters do not conflict with mailto's.
  const encodedUrl = encodeURIComponent(url);
  const emailBody = `${longUrlWarning}${longUrlWarning && encodeURI('\r\n\r\n')}${DEFAULT_EMAIL_MESSAGE} ${encodedUrl}`;
  const mailtoLink = `mailto:?body=${emailBody}`;
  window.location.href = mailtoLink;
};

export { createEmailWithUrl, copyToClipBoard, getUrl };

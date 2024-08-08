import { encodeConfInUrl } from 'vitessce';
import { DEFAULT_LONG_URL_WARNING, DEFAULT_EMAIL_MESSAGE } from './constants';

const getUrl = (conf: object, onOverMaximumUrlLength: () => void) => {
  const baseUrl = window.location.href.split('#')[0];
  const fragment = encodeConfInUrl({
    conf,
    onOverMaximumUrlLength,
  });
  const url = `${baseUrl}#${fragment}`;
  return url;
};

const copyToClipBoard = (conf: object, onOverMaximumUrlLength: () => void) => {
  const url = getUrl(conf, onOverMaximumUrlLength);

  navigator.clipboard
    .writeText(url)
    .then()
    .catch((err) => {
      console.error('Failed to copy text to clipboard: ', err);
    });
};

const createEmailWithUrl = (conf: object) => {
  let longUrlWarning = '';
  const onOverMaximumUrlLength = () => {
    longUrlWarning = DEFAULT_LONG_URL_WARNING;
  };
  const url = getUrl(conf, onOverMaximumUrlLength);
  // We need to encode the URL so its parameters do not conflict with mailto's.
  const encodedUrl = encodeURIComponent(url);
  const emailBody = `${longUrlWarning}${longUrlWarning && encodeURI('\r\n\r\n')}${DEFAULT_EMAIL_MESSAGE} ${encodedUrl}`;
  const mailtoLink = `mailto:?body=${emailBody}`;
  window.location.href = mailtoLink;
};

export { createEmailWithUrl, copyToClipBoard, getUrl };

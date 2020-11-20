import { encodeConfInUrl } from 'vitessce';
import { DEFAULT_LONG_URL_WARNING, DEFAULT_EMAIL_MESSAGE } from './constants';

const copyToClipBoard = (conf, onOverMaximumUrlLength) => {
  const dummy = document.createElement('input');
  document.body.appendChild(dummy);
  const url = `${window.location.href.split('#')[0]}#${encodeConfInUrl({
    conf,
    onOverMaximumUrlLength,
  })}`;
  dummy.setAttribute('value', url);
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
};

const createEmailWithUrl = (conf) => {
  let longUrlWarning = '';
  const url = `${window.location.href.split('#')[0]}#${encodeConfInUrl({
    conf,
    onOverMaximumUrlLength: () => {
      longUrlWarning = DEFAULT_LONG_URL_WARNING;
    },
  })}`;
  // We need to encode the URL so its parameters do not conflict with mailto's.
  const encodedUrl = encodeURIComponent(url);
  const mailtoLink = `mailto:?body=${longUrlWarning}%0D%0A%0D%0A${DEFAULT_EMAIL_MESSAGE} ${encodedUrl}`;
  window.location.href = mailtoLink;
};

export { createEmailWithUrl, copyToClipBoard };

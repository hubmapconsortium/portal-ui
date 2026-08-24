const DEFAULT_LONG_URL_WARNING = 'Warning: Long URLs may not work on some browsers.';

const DEFAULT_EMAIL_MESSAGE = 'Here is an interesting dataset I found in the HuBMAP Data Portal:';

// Shown when a raw config export carries an access token. Deliberately qualitative: the app has no
// visibility into when a groups token actually expires, so it must not promise a duration.
const EXPIRING_TOKEN_WARNING =
  'This configuration contains an access token for non-public data, which will stop working when your session expires. Use "Copy Visualization Link" to share a link that authorizes each viewer with their own credentials.';

export { DEFAULT_LONG_URL_WARNING, DEFAULT_EMAIL_MESSAGE, EXPIRING_TOKEN_WARNING };

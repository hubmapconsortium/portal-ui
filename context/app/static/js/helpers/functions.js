import { BoolMustNot, ExistsQuery } from 'searchkit';

export function isEmptyArrayOrObject(val) {
  if (val.constructor.name === 'Object') {
    return Object.keys(val).length === 0;
  }
  if (val.constructor.name === 'Array') {
    return val.length === 0;
  }
  return false;
}

export function capitalizeString(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function replaceUnderscore(s) {
  return s.replace(/_/g, ' ');
}

export function readCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i !== ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function getTokenParam(nexusToken) {
  return nexusToken ? `?token=${nexusToken}` : '';
}

export function getAuthHeader(nexusToken) {
  return nexusToken
    ? {
        Authorization: `Bearer ${nexusToken}`,
      }
    : {};
}

export function throttle(fn, wait) {
  let previouslyRun;
  let queuedToRun;

  return function invokeFn(...args) {
    const now = Date.now();

    queuedToRun = clearTimeout(queuedToRun);

    if (!previouslyRun || now - previouslyRun >= wait) {
      fn(...args);
      previouslyRun = now;
    } else {
      queuedToRun = setTimeout(invokeFn.bind(null, ...args), wait - (now - previouslyRun));
    }
  };
}

export function tableToDelimitedString(rows, colNames, d) {
  const str = rows.reduce((acc, row) => {
    const rowStr = Object.values(row).join(d);
    return acc.concat('\n', rowStr);
  }, colNames.join(d));
  return str;
}

export function createDownloadUrl(fileStr, fileType) {
  return window.URL.createObjectURL(new Blob([fileStr], { type: fileType }));
}

export function getDefaultQuery() {
  return BoolMustNot(ExistsQuery('next_revision_uuid'));
}

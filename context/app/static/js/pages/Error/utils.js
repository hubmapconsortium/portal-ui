const errorTitle = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Access Denied',
  404: 'Page Not Found',
  504: 'Gateway Timeout',
  500: 'Internal Server Error',
};

export function getErrorTitleAndSubtitle(errorCode, isMaintenancePage, isErrorBoundary) {
  if (isMaintenancePage) {
    return { title: 'Portal Maintenance', subtitle: 'Portal unavailable for scheduled maintenance.' };
  }

  if (isErrorBoundary) {
    const title = errorCode ? errorTitle[errorCode] : 'Error';
    return { title, subtitle: `URL: ${window.location.href}` };
  }

  const expectedTitle = errorTitle?.[errorCode];

  return expectedTitle
    ? { title: expectedTitle, subtitle: `HTTP Error ${errorCode}: ${expectedTitle}` }
    : { title: 'Unexpected Error', subtitle: `HTTP Error ${errorCode}` };
}

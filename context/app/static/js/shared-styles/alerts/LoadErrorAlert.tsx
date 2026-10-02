import React from 'react';

import { SWRError } from 'js/helpers/swr/errors';
import { Alert } from './Alert';

interface LoadErrorAlertProps {
  /** What failed to load, as the start of a sentence, e.g. "Search results". */
  subject: string;
  error: unknown;
}

/** Shown in place of data whose request failed, so the page doesn't look like it is loading forever. */
function LoadErrorAlert({ subject, error }: LoadErrorAlertProps) {
  const status = error instanceof SWRError && error.status ? ` (HTTP ${error.status})` : '';
  return (
    <Alert severity="error">
      {`${subject} could not be loaded${status}. Try reloading the page. If this problem persists, submit a bug report.`}
    </Alert>
  );
}

export default LoadErrorAlert;

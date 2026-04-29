import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

import { Alert } from 'js/shared-styles/alerts';
import { useSearchMode } from '../useSearchMode';

const LOCAL_STORAGE_KEY = 'hubmap-say-see-alert-dismissed';

function readDismissed() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.localStorage.getItem(LOCAL_STORAGE_KEY));
}

function SaySeeAlert() {
  const [dismissed, setDismissed] = useState(readDismissed);
  const [, setMode] = useSearchMode();

  const dismiss = useCallback(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setDismissed(true);
  }, []);

  const exploreAndDismiss = useCallback(() => {
    void setMode('say-see');
    dismiss();
  }, [dismiss, setMode]);

  if (dismissed) return null;

  return (
    <Alert
      severity="info"
      action={
        <Stack direction="row" spacing={1} alignItems="center">
          <Button color="primary" size="small" onClick={exploreAndDismiss}>
            Explore with Say &amp; See Mode (Beta)
          </Button>
          <IconButton aria-label="Dismiss Say and See promo" size="small" onClick={dismiss}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      }
    >
      Try a preview of the Say &amp; See Mode (Beta)! Explore datasets using natural language queries and get instant
      visualizations.
    </Alert>
  );
}

export default SaySeeAlert;

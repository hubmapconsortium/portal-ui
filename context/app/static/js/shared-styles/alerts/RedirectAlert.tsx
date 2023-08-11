import React, { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import { useFlaskDataContext } from 'js/components/Contexts';
import { CloseIcon } from 'js/shared-styles/icons';

import { Alert } from './Alert';

type RedirectAlertProps = {
  messageTemplate: (redirected_from: string) => string;
  severity?: 'info' | 'warning' | 'error' | 'success';
};

const defaultMessageTemplate = (redirected_from: string) => `You were redirected from ${redirected_from}.`;

export function RedirectAlert({ messageTemplate = defaultMessageTemplate, severity = 'info' }: RedirectAlertProps) {
  const { redirected_from } = useFlaskDataContext();
  const [open, setOpen] = useState(true);
  if (!redirected_from) {
    return null;
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          $marginBottom={10}
          action={
            <IconButton
              aria-label="close redirect alert"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          {messageTemplate(redirected_from)}
        </Alert>
      </Collapse>
    </Box>
  );
}

import React, { PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DetailPageAlert } from 'js/components/detailPage/style';
import SeverityIcon from 'js/shared-styles/icons/SeverityIcon';

interface RetractedAlertProps extends PropsWithChildren {
  /** When present, renders a "View Replacement" action linking to the superseding dataset. */
  replacementHref?: string;
}

/**
 * Banner emphasizing that a dataset (or a collection/publication's datasets) has been retracted.
 * Uses the retracted icon + color, with an optional "View Replacement" action.
 */
export function RetractedAlert({ children, replacementHref }: RetractedAlertProps) {
  return (
    <DetailPageAlert
      severity="error"
      icon={<SeverityIcon status="retracted" />}
      sx={{
        borderColor: 'retracted.main',
        color: 'retracted.main',
        '.MuiAlert-icon': { color: 'retracted.main' },
        '.MuiAlert-message': { flexGrow: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.primary' }}>
          {children}
        </Typography>
        {replacementHref && (
          <Button href={replacementHref} sx={{ flexShrink: 0, color: 'primary.main' }}>
            View Replacement
          </Button>
        )}
      </Stack>
    </DetailPageAlert>
  );
}

export default RetractedAlert;

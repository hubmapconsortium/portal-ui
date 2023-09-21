import type { AlertColor } from '@mui/material/Alert';
import type { ReactNode } from 'react';

export type Severity = AlertColor;

export interface SnackbarMessage {
  message: ReactNode;
  severity: Severity;
  key: string | number;
}

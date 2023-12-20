import React from 'react';
import { OutboundLink } from 'js/shared-styles/Links';
import LinearProgress from '@mui/material/LinearProgress';

/**
 * Default message to fall back to if loading the maintenance message fails.
 * @returns
 */
export default function MaintenanceFallbackMessage() {
  return (
    <>
      While the portal is under maintenance, visit the{' '}
      <OutboundLink href="https://hubmapconsortium.org/">HuBMAP Consortium</OutboundLink> website.
    </>
  );
}

/**
 * Loading spinner to fall back to while loading the maintenance message.
 * @returns
 */
export function MaintenanceFallbackLoader() {
  return <LinearProgress variant="indeterminate" />;
}

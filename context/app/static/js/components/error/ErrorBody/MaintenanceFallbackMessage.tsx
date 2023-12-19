import React from 'react';
import { OutboundLink } from 'js/shared-styles/Links';

export default function MaintenanceFallbackMessage() {
  return (
    <>
      While the portal is under maintenance, visit the{' '}
      <OutboundLink href="https://hubmapconsortium.org/">HuBMAP Consortium</OutboundLink> website.
    </>
  );
}

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import React from 'react';
import { usePipelineInfo } from './hooks';

export function PipelineInfo() {
  const { origin, name } = usePipelineInfo();
  return <OutboundLink href={origin}>{name}</OutboundLink>;
}

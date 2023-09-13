import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import React from 'react';
import { usePipelineInfo } from './hooks';

export function PipelineInfo() {
  const { origin, name } = usePipelineInfo();
  return (
    // onClick={undefined} is a workaround
    // for the .jsx definition of OutboundLink not specifying
    // that the `onClick` prop is optional.
    // Once we convert the related files to .ts (HMP-361) we can remove this
    <OutboundLink onClick={undefined} href={origin}>
      {name}
    </OutboundLink>
  );
}

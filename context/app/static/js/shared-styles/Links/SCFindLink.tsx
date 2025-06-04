import React, { PropsWithChildren } from 'react';
import OutboundIconLink from './iconLinks/OutboundIconLink';

export default function SCFindLink({ children = 'scFind method' }: PropsWithChildren) {
  return <OutboundIconLink href="https://www.nature.com/articles/s41592-021-01076-9">{children}</OutboundIconLink>;
}

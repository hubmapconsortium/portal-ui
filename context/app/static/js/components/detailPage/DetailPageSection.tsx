import React, { PropsWithChildren } from 'react';

import { useTotalHeaderOffset } from './entityHeader/EntityHeader/hooks';
import { OffsetSection } from './style';

function DetailPageSection({ children, ...rest }: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  const offset = useTotalHeaderOffset();

  return (
    <OffsetSection $offset={offset} {...rest}>
      {children}
    </OffsetSection>
  );
}

export default DetailPageSection;

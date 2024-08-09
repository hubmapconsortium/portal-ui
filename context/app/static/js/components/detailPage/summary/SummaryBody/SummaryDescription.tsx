import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

import { Entity } from 'js/components/types';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { LineClamp } from 'js/shared-styles/text';

function CustomClamp({ children }: PropsWithChildren) {
  return (
    <LineClamp lines={3} component={Typography}>
      {children}
    </LineClamp>
  );
}

function SummaryDescription({
  description,
  label,
  clamp,
}: { label?: string; clamp?: boolean } & Pick<Entity, 'description'>) {
  if (!description) {
    return null;
  }

  return (
    <LabelledSectionText
      label={label ?? 'Description'}
      childContainerComponent={clamp ? CustomClamp : undefined}
      flexShrink={1}
    >
      {description}
    </LabelledSectionText>
  );
}

export default SummaryDescription;

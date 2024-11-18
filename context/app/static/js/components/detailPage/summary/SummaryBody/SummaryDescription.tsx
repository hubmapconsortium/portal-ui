import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

import { Entity } from 'js/components/types';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { LineClampWithTooltip } from 'js/shared-styles/text';

function CustomClamp({ children }: PropsWithChildren) {
  return (
    <LineClampWithTooltip lines={3}>
      <Typography>{children}</Typography>
    </LineClampWithTooltip>
  );
}

function SummaryDescription({
  description,
  label,
  clamp,
  ...rest
}: { label?: string; clamp?: boolean } & Pick<Entity, 'description'>) {
  if (!description) {
    return null;
  }

  return (
    <LabelledSectionText
      label={label ?? 'Description'}
      childContainerComponent={clamp ? CustomClamp : undefined}
      flexShrink={1}
      {...rest}
    >
      {description}
    </LabelledSectionText>
  );
}

export default SummaryDescription;

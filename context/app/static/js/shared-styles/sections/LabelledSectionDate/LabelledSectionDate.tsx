import React, { ComponentProps } from 'react';
import { format } from 'date-fns/format';

import LabelledSectionText from '../LabelledSectionText';

interface LabelledSectionDateProps extends ComponentProps<typeof LabelledSectionText> {
  timestamp: number;
  dateFormat?: string;
}

function LabelledSectionDate({ timestamp, dateFormat, ...rest }: LabelledSectionDateProps) {
  const dateString = timestamp ? format(timestamp, dateFormat || 'yyyy-MM-dd') : 'Undefined';
  return <LabelledSectionText {...rest}>{dateString}</LabelledSectionText>;
}

export default LabelledSectionDate;

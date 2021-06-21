import React from 'react';
import format from 'date-fns/format';

import LabelledSectionText from '../LabelledSectionText';

function LabelledSectionDate({ label, iconTooltipText, timestamp, dateFormat }) {
  const dateString = format(timestamp, dateFormat || 'yyyy-mm-dd');
  return (
    <LabelledSectionText iconTooltipText={iconTooltipText} label={label}>
      {dateString}
    </LabelledSectionText>
  );
}

export default LabelledSectionDate;

import React from 'react';
import PropTypes from 'prop-types';
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

LabelledSectionDate.propTypes = {
  label: PropTypes.string.isRequired,
  iconTooltipText: PropTypes.string,
  timestamp: PropTypes.number.isRequired,
  dateFormat: PropTypes.string,
};

LabelledSectionDate.defaultProps = {
  iconTooltipText: undefined,
  dateFormat: undefined,
};

export default LabelledSectionDate;

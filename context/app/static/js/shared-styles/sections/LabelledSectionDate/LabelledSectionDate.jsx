import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns/format';

import LabelledSectionText from '../LabelledSectionText';

function LabelledSectionDate({ timestamp, dateFormat, ...rest }) {
  const dateString = timestamp ? format(timestamp, dateFormat || 'yyyy-MM-dd') : 'Undefined';
  return <LabelledSectionText {...rest}>{dateString}</LabelledSectionText>;
}

LabelledSectionDate.propTypes = {
  timestamp: PropTypes.number.isRequired,
  dateFormat: PropTypes.string,
};

LabelledSectionDate.defaultProps = {
  dateFormat: undefined,
};

export default LabelledSectionDate;

/* eslint-disable react/no-array-index-key */
import React from 'react';
import Typography from '@material-ui/core/Typography';

function LabelledSectionText(props) {
  const { children, label, isDate, className } = props;
  return (
    <div className={className}>
      <Typography variant="subtitle2" component="h3" color="primary">
        {label}
      </Typography>
      <Typography component="p" variant={isDate ? 'h6' : 'body1'}>
        {children}
      </Typography>
    </div>
  );
}

export default LabelledSectionText;

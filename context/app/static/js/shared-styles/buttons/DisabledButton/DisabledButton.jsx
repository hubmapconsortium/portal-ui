import React from 'react';
import Button from '@material-ui/core/Button';

function DisabledButton({ disabled, ...props }) {
  return <Button key={disabled} disabled={disabled} {...props} />;
}

export default DisabledButton;

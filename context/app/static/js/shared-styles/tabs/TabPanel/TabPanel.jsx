import React from 'react';
import Typography from '@material-ui/core/Typography';
import { PaddedBox } from './style';

function TabPanel(props) {
  const { children, value, index, className, pad } = props;
  return (
    <Typography
      className={className}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <PaddedBox $pad={pad}>{children}</PaddedBox>}
    </Typography>
  );
}

export default TabPanel;

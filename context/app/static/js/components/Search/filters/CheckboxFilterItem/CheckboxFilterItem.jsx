import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel } from './style';

function CheckboxFilterItem(props) {
  const { active, onClick, label } = props;
  return (
    <StyledFormControlLabel
      control={
        <StyledCheckbox
          checked={active}
          onChange={onClick}
          name="checkedA"
          color="primary"
          icon={<StyledCheckBoxBlankIcon />}
          checkedIcon={<StyledCheckBoxIcon />}
        />
      }
      label={<Typography variant="body2">{label}</Typography>}
    />
  );
}

export default CheckboxFilterItem;

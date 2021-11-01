import React from 'react';
import Typography from '@material-ui/core/Typography';

import {
  StyledCheckBoxBlankIcon,
  StyledCheckBoxIcon,
  StyledCheckbox,
  StyledFormControlLabel,
  Flex,
  FormLabelText,
} from './style';

function CheckboxFilterItem(props) {
  const { active, onClick, label, count } = props;
  return (
    <StyledFormControlLabel
      control={
        <StyledCheckbox
          checked={active}
          onChange={onClick}
          name={`${label}-checkbox`}
          color="primary"
          icon={<StyledCheckBoxBlankIcon />}
          checkedIcon={<StyledCheckBoxIcon />}
        />
      }
      label={
        <Flex>
          <FormLabelText variant="body2">{label}</FormLabelText>
          <Typography variant="body2">{count}</Typography>
        </Flex>
      }
    />
  );
}

export default CheckboxFilterItem;

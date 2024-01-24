import React from 'react';

import FilterLabelAndCount from 'js/components/searchPage/filters/FilterLabelAndCount';

import { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel } from './style';

function CheckboxFilterItem({ active, onClick, label, count, configItemProps }) {
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
      label={<FilterLabelAndCount label={label} count={count} active={active} {...configItemProps} />}
    />
  );
}

export default CheckboxFilterItem;

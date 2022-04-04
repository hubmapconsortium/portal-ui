import React from 'react';

import FilterLabelAndCount from 'js/components/entity-search/facets/select/FilterLabelAndCount';
import { useFilterOnClick } from 'js/components/entity-search/facets/utils';

import { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel } from './style';

function CheckboxFilterItem(props) {
  const { identifier, active, label, count } = props;

  const onClick = useFilterOnClick({ identifier, value: label });
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
      label={<FilterLabelAndCount label={label} count={count} active={active} />}
    />
  );
}

export default CheckboxFilterItem;

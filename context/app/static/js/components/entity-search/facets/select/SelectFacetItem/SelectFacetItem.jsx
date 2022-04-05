import React from 'react';

import FacetItemLabelCount from 'js/components/entity-search/facets/select/FacetItemLabelCount';
import useFilterOnClick from 'js/components/entity-search/searchkit-modifications/useFilterOnClick';

import { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel } from './style';

function SelectFacetItem(props) {
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
      label={<FacetItemLabelCount label={label} count={count} active={active} />}
    />
  );
}

export default SelectFacetItem;

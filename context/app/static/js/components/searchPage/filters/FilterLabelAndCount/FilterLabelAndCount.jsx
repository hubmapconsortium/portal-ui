import React from 'react';
import Typography from '@mui/material/Typography';

import { transformLabel } from './utils';
import { Flex, FormLabelText } from './style';

function FilterLabelAndCount({ label, count, active, labelTransformations = [], ...rest }) {
  return (
    <Flex {...rest} $active={active}>
      <FormLabelText>{transformLabel({ label, labelTransformations })}</FormLabelText>
      <Typography>{count}</Typography>
    </Flex>
  );
}

export default FilterLabelAndCount;

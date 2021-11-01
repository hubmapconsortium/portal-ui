import React from 'react';
import Typography from '@material-ui/core/Typography';

import { Flex, FormLabelText } from './style';

function FilterLabelAndCount({ label, count, active, ...rest }) {
  return (
    <Flex {...rest} $active={active}>
      <FormLabelText variant="body2">{label}</FormLabelText>
      <Typography variant="body2">{count}</Typography>
    </Flex>
  );
}

export default FilterLabelAndCount;

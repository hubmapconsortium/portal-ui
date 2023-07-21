import React from 'react';
import Typography from '@mui/material/Typography';

import { Flex, FormLabelText } from './style';

function FacetItemLabelCount({ label, count, active, ...rest }) {
  return (
    <Flex {...rest} $active={active}>
      <FormLabelText>{label}</FormLabelText>
      <Typography>{count}</Typography>
    </Flex>
  );
}

export default FacetItemLabelCount;

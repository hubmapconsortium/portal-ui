import React from 'react';
import MUISLider from '@material-ui/core/Slider';
import FormHelperText from '@material-ui/core/FormHelperText';

import { StyledFormLabel } from './style';

function Slider({ min, max, value, onChange, id, label, helperText, ...rest }) {
  return (
    <>
      <StyledFormLabel id={id}>{label}</StyledFormLabel>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <MUISLider min={min} max={max} value={value} onChange={onChange} aria-labelledby={id} {...rest} />
    </>
  );
}

export default Slider;

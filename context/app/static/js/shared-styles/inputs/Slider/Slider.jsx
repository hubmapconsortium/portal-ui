import React from 'react';
import MUISLider from '@mui/material/Slider';
import FormHelperText from '@mui/material/FormHelperText';

import { StyledFormLabel } from './style';

function Slider({ min, max, value, onChange, id, label, helperText, ...rest }) {
  return (
    <>
      <StyledFormLabel id={id}>{label}</StyledFormLabel>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <MUISLider
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        aria-labelledby={id}
        valueLabelDisplay="auto"
        {...rest}
      />
    </>
  );
}

export default Slider;

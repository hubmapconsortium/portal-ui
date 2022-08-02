import React from 'react';
import MUISLider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

function Slider({ id, label, helperText, ...rest }) {
  return (
    <>
      <FormLabel id={id}>{label}</FormLabel>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <MUISLider aria-labelledby={id} {...rest} />
    </>
  );
}

export default Slider;

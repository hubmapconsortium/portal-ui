import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  const [inputType, setInputType] = useState('cell');
  const [outputType, setOutputType] = useState('gene');

  function handleSubmit() {
    // eslint-disable-next-line no-alert
    alert(`submit ${inputType} -> ${outputType}`);
  }

  function handleChange(event) {
    const { target } = event;
    const { name } = target;
    const setFields = {
      input: setInputType,
      output: setOutputType,
    };
    setFields[name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="input type" value={inputType} name="input" variant="outlined" onChange={handleChange} />
      <TextField label="output type" value={outputType} name="output" variant="outlined" onChange={handleChange} />
      <Button onClick={handleSubmit}>Submit</Button>
    </Paper>
  );
}

export default CellsAPIDemo;

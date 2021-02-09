import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  const [input_type, setInputType] = useState('cell');
  const [output_type, setOutputType] = useState('gene');
  const [genomic_modality, setGenomicModality] = useState('rna');
  const [has, setHas] = useState('VIM > 0.5');

  function handleSubmit() {
    const query = {
      input_type,
      output_type,
      genomic_modality,
      input_set: [has],
    };

    // eslint-disable-next-line no-alert
    alert(JSON.stringify(query));
  }

  function handleChange(event) {
    const { target } = event;
    const { name } = target;
    const setFields = {
      input_type: setInputType,
      output_type: setOutputType,
      genomic_modality: setGenomicModality,
      has: setHas,
    };
    setFields[name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="input type" value={input_type} name="input_type" variant="outlined" onChange={handleChange} />
      <TextField
        label="output type"
        value={output_type}
        name="output_type"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        label="genomic modality"
        value={genomic_modality}
        name="genomic_modality"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField label="has" value={has} name="has" variant="outlined" onChange={handleChange} />
      <Button onClick={handleSubmit}>Submit</Button>
    </Paper>
  );
}

export default CellsAPIDemo;

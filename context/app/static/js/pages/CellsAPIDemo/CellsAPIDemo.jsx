import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  const [input_type, setInputType] = useState('gene');
  const [output_type, setOutputType] = useState('cell');
  const [genomic_modality, setGenomicModality] = useState('rna');
  const [has, setHas] = useState('VIM > 0.5');

  // const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append('input_type', input_type);
    formData.append('genomic_modality', genomic_modality);
    formData.append('input_set', has);
    // TODO: Pull endpoint from context!
    const response = await fetch(`https://cells.dev.hubmapconsortium.org/api/${output_type}/`, {
      method: 'POST',
      body: formData,
    });
    const responseJson = await response.json();
    if ('message' in responseJson) {
      setError(responseJson.message);
    } else {
      // TODO
    }
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
      <br />
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      {error}
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>test</TableCell>
            <TableCell>test</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>a</TableCell>
            <TableCell>b</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CellsAPIDemo;

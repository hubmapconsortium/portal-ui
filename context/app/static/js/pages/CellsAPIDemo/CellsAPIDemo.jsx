import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  const [input_type, setInputType] = useState('gene');
  const [output_type, setOutputType] = useState('cell');
  const [genomic_modality, setGenomicModality] = useState('rna');
  const [has, setHas] = useState('VIM > 0.5');

  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    // TODO: Pull endpoint from context!
    const urlBase = 'https://cells.dev.hubmapconsortium.org/api/';

    const firstFormData = new FormData();
    firstFormData.append('input_type', input_type);
    firstFormData.append('genomic_modality', genomic_modality);
    firstFormData.append('input_set', has);

    const firstResponse = await fetch(`${urlBase}${output_type}/`, {
      method: 'POST',
      body: firstFormData,
    });
    const firstResponseJson = await firstResponse.json();
    if ('message' in firstResponseJson) {
      setError(`first: ${firstResponseJson.message}`);
      return;
    }
    const handle = firstResponseJson.results[0].query_handle;

    const secondFormData = new FormData();
    secondFormData.append('key', handle);
    secondFormData.append('set_type', output_type);
    secondFormData.append('limit', 10);
    secondFormData.append('values_type', input_type);
    // limit,
    // offset,
    // values_included,
    // sort_by,
    // values_type

    const secondResponse = await fetch(`${urlBase}${output_type}detailevaluation/`, {
      method: 'POST',
      body: secondFormData,
    });
    const secondResponseJson = await secondResponse.json();
    if ('message' in secondResponseJson) {
      setError(`second: ${secondResponseJson.message}`);
      return;
    }

    setResults(secondResponseJson.results);
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
      <ResultsTable results={results} />
    </Paper>
  );
}

function ResultsTable(props) {
  const { results } = props;
  if (results.length === 0) {
    return <p>No results</p>;
  }
  const fields = Object.keys(results[0]);
  return (
    <Table>
      <TableHead>
        <TableRow>
          {fields.map((field) => (
            <TableCell key={field}>{field}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map((result) => (
          <TableRow>
            {fields.map((field) => (
              <TableCell key={field}>
                {/* Results can include objects in the "values" field. */}
                {JSON.stringify(result[field])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CellsAPIDemo;

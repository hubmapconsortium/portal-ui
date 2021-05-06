import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';

// eslint-disable-next-line no-unused-vars
function CellExpressionInDataset(props) {
  const [someField, setSomeField] = useState('field value');

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append('some_field', someField);

    const firstResponse = await fetch('/cells.json', {
      method: 'POST',
      body: formData,
    });
    const responseJson = await firstResponse.json();
    if ('message' in responseJson) {
      setMessage(responseJson.message);
    }
    if ('results' in responseJson) {
      setResults(responseJson.results);
    }
  }

  function handleChange(event) {
    const { target } = event;
    const { name } = target;
    const setFields = {
      some_field: setSomeField,
    };
    setFields[name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="some field" value={someField} name="some_field" variant="outlined" onChange={handleChange} />
      <br />
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      {message}
      <ResultsTable results={results} />
    </Paper>
  );
}

export default CellExpressionInDataset;

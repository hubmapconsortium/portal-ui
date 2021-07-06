import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';

// eslint-disable-next-line no-unused-vars
function DatasetsSelectedByExpression(props) {
  const [name, setName] = useState('VIM');
  const [targetEntity, setTargetEntity] = useState('gene'); // eslint-disable-line no-unused-vars
  const [modality, setModality] = useState('rna'); // eslint-disable-line no-unused-vars
  const [minExpression, setMinExpression] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(10);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    const urlParams = new URLSearchParams();
    urlParams.append('name', name);
    urlParams.append('modality', modality);
    urlParams.append('min_expression', minExpression);
    urlParams.append('min_cell_percentage', minCellPercentage);

    const firstResponse = await fetch(`/cells/datasets-selected-by-${targetEntity}.json?${urlParams}`, {
      method: 'POST',
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
    const setFields = {
      name: setName,
      minExpression: setMinExpression,
      minCellPercentage: setMinCellPercentage,
    };
    setFields[target.name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="name" value={name} name="name" variant="outlined" onChange={handleChange} />
      <TextField
        label="min expression"
        value={minExpression}
        name="minExpression"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        label="min cell percentage"
        value={minCellPercentage}
        name="minCellPercentage"
        variant="outlined"
        onChange={handleChange}
      />
      <br />
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      {message}
      <ResultsTable results={results} />
    </Paper>
  );
}

export default DatasetsSelectedByExpression;

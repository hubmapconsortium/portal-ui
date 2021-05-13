import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';

// eslint-disable-next-line no-unused-vars
function DatasetsSelectedByGene(props) {
  const [geneName, setGeneName] = useState('VIM');
  const [minGeneExpression, setMinGeneExpression] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(100);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    const urlParams = new URLSearchParams();
    urlParams.append('gene_name', geneName);
    urlParams.append('min_gene_expression', minGeneExpression);
    urlParams.append('min_cell_percentage', minCellPercentage);

    const firstResponse = await fetch(`/cells/datasets-selected-by-gene.json?${urlParams}`, {
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
    const { name } = target;
    const setFields = {
      geneName: setGeneName,
      minGeneExpression: setMinGeneExpression,
      minCellPercentage: setMinCellPercentage,
    };
    setFields[name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="gene name" value={geneName} name="geneName" variant="outlined" onChange={handleChange} />
      <TextField
        label="min gene expression"
        value={minGeneExpression}
        name="minGeneExpression"
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

export default DatasetsSelectedByGene;

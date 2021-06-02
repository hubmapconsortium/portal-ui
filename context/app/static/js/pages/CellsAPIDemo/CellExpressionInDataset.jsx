import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';

// eslint-disable-next-line no-unused-vars
function CellExpressionInDataset(props) {
  const [uuid, setUUID] = useState('81a9fa68b2b4ea3e5f7cb17554149473');
  const [geneNames, setGeneNames] = useState('VIM');

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    const urlParams = new URLSearchParams();
    urlParams.append('uuid', uuid);
    geneNames.split(',').forEach((geneName) => {
      urlParams.append('gene_name', geneName);
    });

    const firstResponse = await fetch(`/cells/cell-expression-in-dataset.json?${urlParams}`, {
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
      uuid: setUUID,
      geneNames: setGeneNames,
    };
    setFields[name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="uuid" value={uuid} name="uuid" variant="outlined" onChange={handleChange} />
      <TextField label="gene names" value={geneNames} name="geneNames" variant="outlined" onChange={handleChange} />
      <br />
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      {message}
      <ResultsTable results={results} />
    </Paper>
  );
}

export default CellExpressionInDataset;

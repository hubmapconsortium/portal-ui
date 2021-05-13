import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';

// eslint-disable-next-line no-unused-vars
function CellCountsForDatasets(props) {
  const [uuids, setUUIDs] = useState('81a9fa68b2b4ea3e5f7cb17554149473,other-uuid');
  const [geneName, setGeneName] = useState('VIM');
  const [minGeneExpression, setMinGeneExpression] = useState('1');

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    const urlParams = new URLSearchParams();
    uuids.split(',').forEach((uuid) => {
      urlParams.append('uuid', uuid);
    });
    urlParams.append('gene_name', geneName);
    urlParams.append('min_gene_expression', minGeneExpression);

    const firstResponse = await fetch(`/cells/cell-counts-for-datasets.json?${urlParams}`, {
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
      uuids: setUUIDs,
      geneName: setGeneName,
      minGeneExpression: setMinGeneExpression,
    };
    setFields[name](event.target.value);
  }

  return (
    <Paper>
      <TextField
        label="uuids (comma delimited)"
        value={uuids}
        name="uuids"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField label="gene name" value={geneName} name="geneName" variant="outlined" onChange={handleChange} />
      <TextField
        label="min gene expression"
        value={minGeneExpression}
        name="minGeneExpression"
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

export default CellCountsForDatasets;

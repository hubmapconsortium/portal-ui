import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';
import CellsService from './CellsService';

// eslint-disable-next-line no-unused-vars
function CellPercentagesForDatasets(props) {
  const [uuids, setUUIDs] = useState('14946a8eb12f2d787302f818b72fdc4e,1ca63edfa35971f475c91d92f4a70cb0');
  const [geneName, setGeneName] = useState('VIM');
  const [minGeneExpression, setMinGeneExpression] = useState('1');

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    try {
      const service = new CellsService();
      const serviceResults = await service.getCellPercentagesForDatasets({
        uuids: uuids.split(','),
        geneName,
        minGeneExpression,
      });
      setResults(serviceResults);
    } catch (e) {
      setMessage(e.message);
    }
    const urlParams = new URLSearchParams();
    uuids.split(',').forEach((uuid) => {
      urlParams.append('uuid', uuid);
    });
    urlParams.append('gene_name', geneName);
    urlParams.append('min_gene_expression', minGeneExpression);

    const firstResponse = await fetch(`/cells/cell-percentages-for-datasets.json?${urlParams}`, {
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

export default CellPercentagesForDatasets;

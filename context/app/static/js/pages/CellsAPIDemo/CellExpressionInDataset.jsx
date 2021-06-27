import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';
import CellsService from './CellsService';

// eslint-disable-next-line no-unused-vars
function CellExpressionInDataset(props) {
  const [uuid, setUUID] = useState('81a9fa68b2b4ea3e5f7cb17554149473');
  const [geneNames, setGeneNames] = useState('VIM');

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    try {
      const service = new CellsService();
      const serviceResults = await service.getCellExpressionInDataset({
        uuid,
        geneNames: geneNames.split(','),
      });
      setResults(serviceResults);
    } catch (e) {
      setMessage(e.message);
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

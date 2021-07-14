import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';
import CellsService from './CellsService';

// eslint-disable-next-line no-unused-vars
function AllIndexedUUIDs(props) {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    try {
      const serviceResults = await new CellsService().getAllIndexedUUIDs();
      setResults(serviceResults);
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <Paper>
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      {message}
      <ResultsTable results={results} />
    </Paper>
  );
}

export default AllIndexedUUIDs;

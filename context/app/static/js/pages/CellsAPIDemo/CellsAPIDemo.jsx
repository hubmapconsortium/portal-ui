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
              <TableCell key={field}>{result[field]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CellsAPIDemo;

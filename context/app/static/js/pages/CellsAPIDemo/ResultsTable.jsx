import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

function ResultsTable(props) {
  const { results } = props;
  if (results.length === 0) {
    return <p>No results</p>;
  }
  const flatResults = results.map((row) => {
    const flatRow = {};
    Object.entries(row).forEach(([key, value]) => {
      if (typeof value !== 'object') {
        flatRow[key] = value;
      } else {
        // Shouldn't be deeper than one layer, so recursion would be overkill.
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          flatRow[`${key}.${nestedKey}`] = nestedValue;
        });
      }
    });
    return flatRow;
  });
  const fields = Object.keys(flatResults[0]);
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
        {flatResults.map((result) => (
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

export default ResultsTable;

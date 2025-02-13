import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { queryTypes } from 'js/components/cells/queryTypes';
import { TextField, Typography } from '@mui/material';
import { useQuerySelect } from './hooks';

function QueryType() {
  const { queryType, handleSelect, handleButtonClick } = useQuerySelect();
  return (
    <Stack gap={2} py={2}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="subtitle1">Query Type</Typography>
        <Typography variant="body2">Choose the query method to retrieve gene, protein, or cell type data.</Typography>
        <TextField
          id="query-select"
          label="Query Type"
          value={queryType}
          onChange={handleSelect}
          variant="outlined"
          select
          fullWidth
        >
          {Object.values(queryTypes).map((type) => (
            <MenuItem value={type.value} key={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
      </Paper>
      <Button variant="contained" sx={{ width: 'fit-content' }} color="primary" onClick={handleButtonClick}>
        Set Parameters
      </Button>
    </Stack>
  );
}

export default QueryType;

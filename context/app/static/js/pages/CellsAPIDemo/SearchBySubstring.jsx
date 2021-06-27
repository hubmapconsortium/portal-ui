import React, { useState } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import CellsService from './CellsService';

// eslint-disable-next-line no-unused-vars
function SearchBySubstring(props) {
  const { targetEntity } = props;

  const [substring, setSubstring] = useState('');
  const [options, setOptions] = useState([]);

  async function handleChange(event) {
    const { target } = event;
    setSubstring(target.value);

    if (target.value === '') {
      setOptions([]);
      return;
    }

    try {
      const service = new CellsService();
      const serviceResults = await service.searchBySubstring({
        targetEntity,
        substring: target.value,
      });
      setOptions(serviceResults);
    } catch (e) {
      console.warn(e.message);
    }
  }

  return (
    <Paper>
      <Autocomplete
        options={options}
        renderOption={(option) => (
          <>
            {option.pre}
            <b>{option.match}</b>
            {option.post}
          </>
        )}
        renderInput={(params) => (
          <TextField
            label="substring"
            value={substring}
            name="substring"
            variant="outlined"
            onChange={handleChange}
            {...params}
          />
        )}
      />
    </Paper>
  );
}

export default SearchBySubstring;

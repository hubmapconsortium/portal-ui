import React, { useState } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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

    const urlParams = new URLSearchParams();
    urlParams.append('substring', target.value);

    const firstResponse = await fetch(`/cells/${targetEntity}-by-substring.json?${urlParams}`, {
      method: 'POST',
    });
    const responseJson = await firstResponse.json();
    if ('message' in responseJson) {
      console.warn(responseJson.message);
    }
    if ('results' in responseJson) {
      setOptions(responseJson.results.map((row) => row.full));
    }
  }

  return (
    <Paper>
      <Autocomplete
        options={options}
        renderInput={(params) => (
          // eslint-disable-next-line prettier/prettier
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

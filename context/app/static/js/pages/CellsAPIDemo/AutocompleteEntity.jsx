import React, { useState } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import CellsService from './CellsService';

function AutocompleteEntity(props) {
  const { targetEntity, setter } = props;

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
      setOptions(
        await new CellsService().searchBySubstring({
          targetEntity,
          substring: target.value,
        }),
      );
    } catch (e) {
      console.warn(e.message);
    }
  }

  return (
    <Autocomplete
      options={options}
      multiple
      getOptionLabel={(option) => option.full}
      renderOption={(option) => (
        <>
          {option.pre}
          <b>{option.match}</b>
          {option.post}
        </>
      )}
      onChange={(event, value) => {
        setter(value.map((match) => match.full));
      }}
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
  );
}

export default AutocompleteEntity;

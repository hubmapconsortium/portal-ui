import React, { useState, useEffect } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import CellsService from 'js/components/cells/CellsService';

function AutocompleteEntity(props) {
  const { targetEntity, setter, setCellVariableNames } = props;

  const [substring, setSubstring] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
    setCellVariableNames([]);
  }, [targetEntity, setCellVariableNames]);

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
      value={selected}
      onChange={(event, value) => {
        setSelected(value);
        setter(value.map((match) => match.full));
      }}
      renderInput={(params) => (
        <TextField
          label={`Select ${targetEntity} to query`}
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

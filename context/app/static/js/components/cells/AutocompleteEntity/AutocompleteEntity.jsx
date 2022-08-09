import React, { useState, useEffect } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import CellsService from 'js/components/cells/CellsService';

function buildHelperText(entity) {
  return `Multiple ${entity} are allowed and only 'AND' queries are supported.`;
}

const labelAndHelperTextProps = {
  genes: { label: 'Gene Symbol', helperText: buildHelperText('gene symbols') },
  proteins: { label: 'Protein', helperText: buildHelperText('proteins') },
};

function AutocompleteEntity({ targetEntity, setter, setCellVariableNames }) {
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
      renderInput={({ InputLabelProps, ...params }) => (
        <TextField
          InputLabelProps={{ shrink: true, ...InputLabelProps }}
          {...labelAndHelperTextProps[targetEntity]}
          placeholder={`Select ${targetEntity} to query`}
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

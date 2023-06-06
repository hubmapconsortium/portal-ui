import React, { useState, useEffect, useCallback } from 'react';

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

function AutocompleteEntity({ targetEntity, setter, cellVariableNames, setCellVariableNames }) {
  const [substring, setSubstring] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([]);
    setCellVariableNames([]);
  }, [targetEntity, setCellVariableNames]);

  const handleChange = useCallback(async function handleChange(event) {
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
  }, []);

  return (
    <Autocomplete
      options={options}
      multiple
      getOptionLabel={(option) => option}
      getOptionSelected={(option, value) => option.full === value}
      renderOption={(option) => (
        <>
          {option.pre}
          <b>{option.match}</b>
          {option.post}
        </>
      )}
      value={cellVariableNames}
      onChange={(event, value) => {
        // Needed to avoid a second list in state of 'selections'.
        setter(value.map((match) => (match.constructor.name === 'Object' && match?.full ? match.full : match)));
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

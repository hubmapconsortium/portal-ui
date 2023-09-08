import React, { useState, useEffect, useRef } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

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

  const loading = useRef(false);

  async function handleChange(event) {
    const { target } = event;
    setSubstring(target.value);

    // Keep already-selected options present in options list to prevent "invalid value" warning
    const selectedOptions = cellVariableNames.map((name) => ({
      match: name,
      full: name,
    }));

    if (target.value === '') {
      setOptions(selectedOptions);
      return;
    }

    try {
      loading.current = true;
      const newOptions = await new CellsService().searchBySubstring({
        targetEntity,
        substring: target.value,
      });
      loading.current = false;
      setOptions(
        newOptions.reduce((acc, option) => {
          if (!selectedOptions.some((existingOption) => existingOption.full === option.full)) {
            acc.push(option);
          }
          return acc;
        }, selectedOptions),
      );
    } catch (e) {
      loading.current = false;
      console.warn(e.message);
    }
  }

  return (
    <Autocomplete
      options={options}
      multiple
      filterSelectedOptions
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.full)}
      isOptionEqualToValue={(option, value) => option.full === value}
      loading={loading.current}
      renderOption={(props, option) => (
        <li {...props}>
          {option.pre}
          <b>{option.match}</b>
          {option.post}
        </li>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          return <Chip key={option} label={option} {...getTagProps({ index })} />;
        })
      }
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

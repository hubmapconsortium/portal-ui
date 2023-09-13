import React, { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useAutocompleteQuery } from './hooks';
import { AutocompleteQueryResponse } from './types';

function buildHelperText(entity: string): string {
  return `Multiple ${entity} are allowed and only 'AND' queries are supported.`;
}

const labelAndHelperTextProps: Record<string, Pick<TextFieldProps, 'label' | 'helperText'>> = {
  genes: { label: 'Gene Symbol', helperText: buildHelperText('gene symbols') },
  proteins: { label: 'Protein', helperText: buildHelperText('proteins') },
};

type AutocompleteEntityProps = {
  targetEntity: string;
  setter: (value: string[]) => void;
};

function AutocompleteEntity({ targetEntity, setter }: AutocompleteEntityProps) {
  const [substring, setSubstring] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<AutocompleteQueryResponse>([]);

  useEffect(() => {
    // Unwrap selected options and pass to setter to keep values in sync
    setter(selectedOptions.map((match) => match.full));
  }, [selectedOptions, setter]);

  useEffect(() => {
    // Reset selected options and substring when target entity changes
    setSubstring('');
    setSelectedOptions([]);
  }, [targetEntity]);

  const { data, isLoading } = useAutocompleteQuery({ targetEntity, substring });

  // Include currently selected options to avoid invalid value errors in console
  const options = selectedOptions.concat(data || []);

  function handleChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    setSubstring(value);
  }

  return (
    <Autocomplete
      value={selectedOptions}
      options={options}
      multiple
      filterSelectedOptions
      getOptionLabel={(option) => option.full}
      isOptionEqualToValue={(option, value) => option.full === value.full}
      loading={isLoading}
      renderOption={(props, option) => (
        <li {...props}>
          {option.pre}
          <b>{option.match}</b>
          {option.post}
        </li>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          return <Chip label={option.full} {...getTagProps({ index })} key={option.full} />;
        })
      }
      onChange={(_, value) => {
        setSelectedOptions(value);
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

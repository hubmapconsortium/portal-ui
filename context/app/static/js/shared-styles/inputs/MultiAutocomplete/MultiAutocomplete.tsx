import React, { useState, ElementType } from 'react';

import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';

interface MultiAutocompleteTypes<Value> extends Omit<AutocompleteProps<Value, true, false, false>, 'renderInput'> {
  tagComponent: ElementType;
  renderInputProps?: TextFieldProps<'outlined'>;
}

function MultiAutocomplete<Value>({
  renderInputProps,
  tagComponent: TagComponent,
  options,
  ...rest
}: MultiAutocompleteTypes<Value>) {
  const [substring, setSubstring] = useState('');

  function handleChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    setSubstring(value);
  }

  return (
    <Autocomplete
      options={options}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          return <TagComponent option={option} {...getTagProps({ index })} key={option} />;
        })
      }
      {...rest}
      renderInput={({ InputLabelProps, ...textFieldProps }) => (
        <TextField
          InputLabelProps={{ shrink: true, ...InputLabelProps }}
          value={substring}
          variant="outlined"
          name="substring"
          onChange={handleChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
          }}
          {...textFieldProps}
          {...renderInputProps}
        />
      )}
    />
  );
}

export default MultiAutocomplete;

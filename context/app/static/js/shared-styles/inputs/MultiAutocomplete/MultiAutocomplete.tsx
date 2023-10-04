import React, { useState } from 'react';

import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { InputLabelProps as inputLabelProps } from '@mui/material/InputLabel';

interface MultiAutocompleteTypes extends AutocompleteProps {
  tagComponent: React.ReactNode;
  renderInputProps: TextFieldProps;
}

interface RenderInputTypes {
  InputLabelProps: inputLabelProps;
  textFieldProps: TextFieldProps;
}

function MultiAutocomplete({ renderInputProps, tagComponent: TagComponent, ...rest }): MultiAutocompleteTypes {
  const [substring, setSubstring] = useState('');

  function handleChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    setSubstring(value);
  }

  return (
    <Autocomplete
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          return <TagComponent option={option} {...getTagProps({ index })} key={option} />;
        })
      }
      renderInput={({ InputLabelProps, ...textFieldProps }: RenderInputTypes) => (
        <TextField
          InputLabelProps={{ shrink: true, ...InputLabelProps }}
          value={substring}
          name="substring"
          variant="outlined"
          onChange={handleChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
          }}
          {...textFieldProps}
        />
      )}
      {...rest}
    />
  );
}

export default MultiAutocomplete;

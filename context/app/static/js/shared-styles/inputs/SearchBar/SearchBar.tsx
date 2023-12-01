import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { TextFieldProps } from '@mui/material/TextField';

import { StyledTextField } from './style';

type SearchBarProps = TextFieldProps;

function SearchBar({ onChange, ...rest }: SearchBarProps) {
  return (
    <StyledTextField
      variant="outlined"
      size="small"
      margin="none"
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon color="primary" />
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
}

export default SearchBar;

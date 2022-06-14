import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

import { StyledTextField } from './style';

function SearchBar({ onChange, ...rest }) {
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

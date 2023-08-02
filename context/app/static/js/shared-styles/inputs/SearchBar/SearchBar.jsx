import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

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

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
};
export default SearchBar;

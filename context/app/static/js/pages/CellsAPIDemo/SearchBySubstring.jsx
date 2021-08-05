import React from 'react';

import Paper from '@material-ui/core/Paper';

import AutocompleteEntity from './AutocompleteEntity';

function SearchBySubstring(props) {
  const { targetEntity } = props;

  return (
    <Paper>
      <AutocompleteEntity targetEntity={targetEntity} />
    </Paper>
  );
}

export default SearchBySubstring;

import React from 'react';
import Paper from '@mui/material/Paper';

import { useSearchStore } from '../store';
import { TermFacet } from './TermFacet';

export function Facets() {
  const { terms } = useSearchStore();

  return (
    <Paper sx={{ maxWidth: 246 }}>
      {Object.keys(terms).map((term) => (
        <TermFacet field={term} key={term} />
      ))}
    </Paper>
  );
}

export default Facets;

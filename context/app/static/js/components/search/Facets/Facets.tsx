import React from 'react';
import Paper from '@mui/material/Paper';

import { useSearchStore } from '../store';
import { TermFacet, HierarchicalTermFacet } from './TermFacet';

export function Facets() {
  const { terms, termz } = useSearchStore();

  return (
    <Paper sx={{ maxWidth: 246 }}>
      {Object.keys(terms).map((term) => (
        <TermFacet field={term} key={term} />
      ))}
      {Object.entries(termz).map(([parentField, { childField }]) => {
        return <HierarchicalTermFacet parentField={parentField} key={parentField} childField={childField} />;
      })}
    </Paper>
  );
}

export default Facets;

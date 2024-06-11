import React from 'react';
import Paper from '@mui/material/Paper';

import { useSearchStore } from '../store';
import { TermFacet, HierarchicalTermFacet } from './TermFacet';
import RangeFacet from './RangeFacet';

export function Facets() {
  const { terms, hierarchicalTerms, ranges } = useSearchStore();

  return (
    <Paper sx={{ maxWidth: 246, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      {Object.keys(terms).map((term) => (
        <TermFacet field={term} key={term} />
      ))}
      {Object.entries(hierarchicalTerms).map(([parentField, { childField }]) => {
        return <HierarchicalTermFacet parentField={parentField} key={parentField} childField={childField} />;
      })}
      {Object.keys(ranges).map((field) => {
        return <RangeFacet key={field} field={field} />;
      })}
    </Paper>
  );
}

export default Facets;

import React from 'react';

import QueryMethod from './QueryMethod';
import AutocompleteEntity from './AutocompleteEntity';
import { useQueryType } from './hooks';
import { FormFieldContainer } from './FormField';
import GenePathwaysAutocomplete from './AutocompleteEntity/GenePathwaysAutocomplete';

interface QueryParametersFieldsetProps {
  defaultValue?: string;
}

function GeneParameters({ defaultValue }: QueryParametersFieldsetProps) {
  return (
    <>
      <QueryMethod />
      <FormFieldContainer title="Gene and Pathway Selection">
        <GenePathwaysAutocomplete />
        <AutocompleteEntity targetEntity="gene" defaultValue={defaultValue} />
      </FormFieldContainer>
    </>
  );
}

function CellTypeParameters({ defaultValue }: QueryParametersFieldsetProps) {
  return (
    <>
      <QueryMethod />
      <FormFieldContainer title="Cell Type Selection">
        <AutocompleteEntity defaultValue={defaultValue} targetEntity="cell-type" />
      </FormFieldContainer>
    </>
  );
}

function QueryParametersFieldset({ defaultValue }: QueryParametersFieldsetProps) {
  const queryType = useQueryType();

  if (queryType.value === 'gene') {
    return <GeneParameters defaultValue={defaultValue} />;
  }

  return <CellTypeParameters defaultValue={defaultValue} />;
}

export default QueryParametersFieldset;

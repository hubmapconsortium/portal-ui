import React from 'react';

import EntitySearchWrapper from 'js/components/entitySearch/EntitySearchWrapper';

function DonorSearch() {
  return (
    <EntitySearchWrapper
      uniqueFilters={[]}
      uniqueFields={[
        [`mapped_metadata.body_mass_index_value`, 'Age'],
        [`mapped_metadata.age_value`, 'BMI'],
        ['mapped_metadata.sex', 'Sex'],
        ['mapped_metadata.race', 'Race'],
      ]}
      entityTypeKeyword="Donor"
    />
  );
}

export default DonorSearch;

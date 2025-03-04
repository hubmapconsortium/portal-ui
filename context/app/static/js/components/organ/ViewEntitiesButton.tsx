import React from 'react';
import Button from '@mui/material/Button';
import { DatasetIcon } from 'js/shared-styles/icons';
import { SearchURLTypes, getSearchURL } from 'js/components/organ/utils';

function ViewEntitiesButton({
  entityType,
  filters,
}: {
  entityType: 'Donor' | 'Dataset' | 'Sample';
  filters: Omit<SearchURLTypes, 'entityType'>;
}) {
  return (
    <Button
      color="primary"
      variant="outlined"
      component="a"
      href={getSearchURL({ entityType, ...filters })}
      startIcon={<DatasetIcon />}
    >
      View {entityType}s
    </Button>
  );
}

export default ViewEntitiesButton;

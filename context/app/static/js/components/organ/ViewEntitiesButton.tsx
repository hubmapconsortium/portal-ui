import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { DatasetIcon } from 'js/shared-styles/icons';
import { SearchURLTypes, getSearchURL } from 'js/components/organ/utils';

interface ViewEntitiesButtonProps extends ButtonProps {
  entityType: 'Donor' | 'Dataset' | 'Sample';
  filters: Omit<SearchURLTypes, 'entityType'>;
}
function ViewEntitiesButton({ entityType, filters, ...rest }: ViewEntitiesButtonProps) {
  return (
    <Button
      color="primary"
      variant="outlined"
      component="a"
      href={getSearchURL({ entityType, ...filters })}
      startIcon={<DatasetIcon />}
      {...rest}
    >
      View {entityType}s
    </Button>
  );
}

export default ViewEntitiesButton;

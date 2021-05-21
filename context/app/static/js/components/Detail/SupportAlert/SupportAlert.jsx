import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import { Typography } from '@material-ui/core';
import { StyledAlert } from './style';
import { getImmediateDatasetAncestors } from './utils';

function SupportAlert({ immediate_ancestors, uuid }) {
  const immediateDatasetAncestors = getImmediateDatasetAncestors(immediate_ancestors);

  // We only expect a single immediate parent dataset for each support, but best to provide a fallback.
  const singleDatasetAncestor = immediateDatasetAncestors.length === 1;

  return (
    <StyledAlert severity="warning">
      <Typography variant="body2">
        “Support” entities provide derived, low-level data for visualizations. Navigate to{' '}
        {singleDatasetAncestor ? (
          <LightBlueLink href={`/browse/dataset/${immediateDatasetAncestors[0]}`}>the parent dataset</LightBlueLink>
        ) : (
          <LightBlueLink href={`/search?descendant_ids[0]=${uuid}&entity_type[0]=Dataset`}>
            the parent datasets
          </LightBlueLink>
        )}{' '}
        for a view of this information in context.
      </Typography>
    </StyledAlert>
  );
}

export default SupportAlert;

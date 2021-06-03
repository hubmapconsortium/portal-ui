import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import { Typography } from '@material-ui/core';
import { StyledAlert } from './style';
import { getImmediateDatasetAncestors } from './utils';

function SupportAlert({ immediate_ancestors, uuid }) {
  const immediateDatasetAncestors = getImmediateDatasetAncestors(immediate_ancestors);

  // We only expect a single immediate parent dataset for each support, but best to provide a fallback.
  const hasSingleDatasetAncestor = immediateDatasetAncestors.length === 1;
  const parentDatasetHref = hasSingleDatasetAncestor
    ? `/browse/dataset/${immediateDatasetAncestors[0]}`
    : `/search?descendant_ids[0]=${uuid}&entity_type[0]=Dataset`;

  return (
    <StyledAlert severity="warning">
      <Typography variant="body2">
        “Support” entities provide derived, low-level data for visualizations. Navigate to{' '}
        <LightBlueLink href={parentDatasetHref}>the parent dataset{!hasSingleDatasetAncestor && 's'}</LightBlueLink> for
        a view of this information in context.
      </Typography>
    </StyledAlert>
  );
}

export default SupportAlert;

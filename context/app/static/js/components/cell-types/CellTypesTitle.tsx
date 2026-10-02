import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { capitalizeString } from 'js/helpers/functions';
import { useCellTypeName } from './hooks';

export default function CellTypesTitle() {
  const name = useCellTypeName();
  // An h2: the "Cell Type" SummaryTitle above it is the page's h1.
  return <PageTitle component="h2">{capitalizeString(name) ?? <Skeleton />}</PageTitle>;
}

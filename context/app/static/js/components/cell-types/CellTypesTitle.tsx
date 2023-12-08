import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { capitalizeString } from 'js/helpers/functions';
import { useCellTypeName } from './hooks';

export default function CellTypesTitle() {
  const name = useCellTypeName();
  return <PageTitle>{capitalizeString(name) ?? <Skeleton />}</PageTitle>;
}

import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useGeneEntities } from '../hooks';

export default function OrganCount() {
  const { data, isLoading } = useGeneEntities();
  if (!isLoading && !data) {
    return null;
  }
  const count = data ? Object.keys(data.organs).length : <Skeleton width={16} sx={{ mr: 0.5 }} />;
  return (
    <Typography variant="subtitle1" display="flex" alignItems="items-center">
      {count} Organs
    </Typography>
  );
}

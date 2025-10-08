import React, { useMemo } from 'react';
import LineUp, {
  LineUpStringColumnDesc,
  LineUpNumberColumnDesc,
  LineUpCategoricalColumnDesc,
  LineUpDateColumnDesc,
} from 'lineupjsx';
import 'lineupjsx/build/LineUpJSx.css';
import Paper from '@mui/material/Paper';

import { useMetadataFieldTypes } from 'js/hooks/useUBKG';
import { ESEntityType } from 'js/components/types';
import { useLineupPageEntities } from './hooks';
import Skeleton from '@mui/material/Skeleton';

interface LineUpProps {
  uuids?: string[];
  entityType?: ESEntityType;
}

const notEnumFields = new Set([
  'uuid',
  // Donors:
  'hubmap_id',
  'medical_history',
  // Samples:
  'donor.hubmap_id',
  'sample_id',
  // Datasets:
  'description',
  'library_adapter_sequence',
  'library_id',
]);

function LineUpPage({ uuids, entityType }: LineUpProps) {
  const { searchHits: entities = [], isLoading } = useLineupPageEntities({ uuids, entityType });

  const dataKeys = useMemo(() => {
    if (entities.length === 0) {
      return [];
    }
    // Get keys of first row
    const firstRow = entities[0];
    const entityKeys = Object.keys(firstRow).sort();

    return entityKeys;
  }, [entities]);

  const { data: metadataFieldTypes } = useMetadataFieldTypes();

  if (Object.keys(metadataFieldTypes).length === 0) {
    return null;
  }

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  const columns = dataKeys.map((key) => {
    if (metadataFieldTypes[key] === 'number' || metadataFieldTypes[key] === 'integer') {
      return <LineUpNumberColumnDesc column={key} key={key} />;
    }
    if (metadataFieldTypes[key] === 'datetime') {
      return <LineUpDateColumnDesc column={key} key={key} />;
    }
    if (notEnumFields.has(key)) {
      return <LineUpStringColumnDesc column={key} key={key} />;
    }
    return <LineUpCategoricalColumnDesc column={key} key={key} />;
  });

  return (
    <Paper>
      <LineUp data={entities}>{columns}</LineUp>
    </Paper>
  );
}

export default LineUpPage;

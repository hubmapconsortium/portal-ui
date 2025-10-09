import React from 'react';
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
import { useLineupEntities } from './hooks';
import Skeleton from '@mui/material/Skeleton';

interface LineUpProps {
  uuids?: string[];
  entityType?: ESEntityType;
}

const notEnumFields = new Set([
  'uuid',
  'hubmap_id',
  'title',
  // Donors:
  'medical_history',
  // Samples:
  'donor.hubmap_id',
  'sample_id',
  // Datasets:
  'description',
  'library_adapter_sequence',
  'library_id',
]);

interface LineUpColumnsProps {
  dataKeys: string[];
}

function LineUpColumns({ dataKeys }: LineUpColumnsProps) {
  const { data: metadataFieldTypes } = useMetadataFieldTypes();
  if (Object.keys(metadataFieldTypes).length === 0) {
    return null;
  }
  return (
    <>
      {dataKeys.map((key) => {
        const fieldType = metadataFieldTypes[key];
        if (fieldType === 'number' || fieldType === 'integer') {
          return <LineUpNumberColumnDesc column={key} key={key} />;
        }
        if (fieldType === 'datetime') {
          return <LineUpDateColumnDesc column={key} key={key} />;
        }
        if (notEnumFields.has(key)) {
          return <LineUpStringColumnDesc column={key} key={key} />;
        }
        return <LineUpCategoricalColumnDesc column={key} key={key} />;
      })}
    </>
  );
}

function LineUpWrapper({ uuids, entityType }: LineUpProps) {
  const { entities = [], isLoading, allKeys: dataKeys } = useLineupEntities({ uuids, entityType });

  const { data: metadataFieldTypes } = useMetadataFieldTypes();

  if (isLoading || Object.keys(metadataFieldTypes).length === 0) {
    return (
      <Paper>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Paper>
    );
  }

  return (
    <Paper>
      <LineUp data={entities}>
        <LineUpColumns dataKeys={dataKeys} />
      </LineUp>
    </Paper>
  );
}

export default LineUpWrapper;

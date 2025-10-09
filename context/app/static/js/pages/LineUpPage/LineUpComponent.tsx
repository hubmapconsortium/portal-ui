import React, { useCallback, useMemo, useState } from 'react';
import LineUp, {
  LineUpStringColumnDesc,
  LineUpNumberColumnDesc,
  LineUpCategoricalColumnDesc,
  LineUpDateColumnDesc,
} from 'lineupjsx';
import 'lineupjsx/build/LineUpJSx.css';
import Paper from '@mui/material/Paper';

import { useMetadataFieldDescriptions, useMetadataFieldTypes } from 'js/hooks/useUBKG';
import { ESEntityType } from 'js/components/types';
import { useLineupEntities } from './hooks';
import Skeleton from '@mui/material/Skeleton';
import SelectableTransferList from './SelectableTransferList';
import Stack from '@mui/material/Stack';
import { useEventCallback } from '@mui/material/utils';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { decimal } from 'js/helpers/number-format';
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

interface LineUpTransferListProps {
  initialItems: string[];
  onConfirm: (items: string[]) => void;
  hitCount: number;
  entityType?: ESEntityType;
}

function LineUpTransferList({ initialItems, onConfirm, hitCount, entityType }: LineUpTransferListProps) {
  const [left, setLeft] = useState(initialItems);
  const [right, setRight] = useState<string[]>([]);

  const { data: fieldDescriptions, isLoading } = useMetadataFieldDescriptions();

  const getFieldDescription = useCallback(
    (field: string) => {
      if (isLoading || !fieldDescriptions) {
        return null;
      }
      return fieldDescriptions[field] || null;
    },
    [fieldDescriptions, isLoading],
  );

  const confirm = useEventCallback(() => {
    onConfirm(right);
  });

  const entityLabel = useMemo(() => {
    const isPlural = hitCount !== 1;
    if (!entityType) {
      return isPlural ? `${decimal.format(hitCount)} Entities` : 'Entity';
    }
    return isPlural ? `${decimal.format(hitCount)} ${entityType}s` : entityType;
  }, [hitCount, entityType]);

  return (
    <Stack gap={1}>
      <Typography variant="h4">Select Fields to Visualize for {entityLabel}</Typography>
      <SelectableTransferList
        left={left}
        right={right}
        setLeft={setLeft}
        setRight={setRight}
        itemSecondaryDescriptions={getFieldDescription}
        isLoadingSecondaryDescriptions={isLoading}
      />
      <Button variant="contained" onClick={confirm} disabled={right.length === 0} sx={{ alignSelf: 'center' }}>
        Confirm
      </Button>
    </Stack>
  );
}

function LineUpWrapper({ uuids, entityType }: LineUpProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const {
    entities = [],
    isLoading,
    allKeys: dataKeys,
    hitCount,
  } = useLineupEntities({ uuids, entityType, selectedKeys });

  const { data: metadataFieldTypes } = useMetadataFieldTypes();

  if (isLoading || Object.keys(metadataFieldTypes).length === 0) {
    return (
      <Paper>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Paper>
    );
  }

  if (selectedKeys.length === 0) {
    return (
      <LineUpTransferList
        initialItems={dataKeys}
        onConfirm={setSelectedKeys}
        hitCount={hitCount}
        entityType={entityType}
      />
    );
  }

  return (
    <Paper>
      <LineUp data={entities}>
        <LineUpColumns dataKeys={selectedKeys} />
      </LineUp>
    </Paper>
  );
}

export default LineUpWrapper;

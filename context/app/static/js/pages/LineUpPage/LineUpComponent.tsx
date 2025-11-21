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
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import Box from '@mui/material/Box';
interface LineUpProps {
  uuids?: string[];
  entityType?: ESEntityType;
  filters?: Record<string, unknown>;
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

  const confirmIsDisabled = right.length === 0;
  const confirmTooltip = confirmIsDisabled ? 'Select fields to visualize in Lineup.' : undefined;

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
        leftTitle="Available Fields"
        rightTitle="Fields to Visualize"
        moveToLeftTooltip="Move selected back to Available Fields."
        moveToRightTooltip="Move selected to Visualize."
      />
      <SecondaryBackgroundTooltip title={confirmTooltip}>
        <Box alignSelf="center">
          <Button variant="contained" onClick={confirm} disabled={confirmIsDisabled}>
            Confirm
          </Button>
        </Box>
      </SecondaryBackgroundTooltip>
    </Stack>
  );
}

const usePluralEntityLabel = (entityType: ESEntityType | undefined, count: number) => {
  if (!entityType) {
    return count === 1 ? 'Entity' : 'Entities';
  }
  return count === 1 ? entityType : `${entityType}s`;
};

function LineUpWrapper({ uuids, entityType, filters }: LineUpProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const {
    entities = [],
    isLoading,
    allKeys: dataKeys,
    totalHitsCount,
  } = useLineupEntities({ uuids, entityType, selectedKeys, filters });

  const { data: metadataFieldTypes } = useMetadataFieldTypes();

  const label = usePluralEntityLabel(entityType, totalHitsCount || 0);

  if (isLoading || Object.keys(metadataFieldTypes).length === 0 || !totalHitsCount) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {totalHitsCount && totalHitsCount > 0 && (
          <Typography variant="h4" alignSelf={'flex-start'}>
            Loading data for {decimal.format(totalHitsCount)} {label.toLocaleLowerCase()}...
          </Typography>
        )}
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ flex: 1 }} />
      </Box>
    );
  }

  if (selectedKeys.length === 0) {
    return (
      <LineUpTransferList
        initialItems={dataKeys}
        onConfirm={setSelectedKeys}
        hitCount={totalHitsCount}
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

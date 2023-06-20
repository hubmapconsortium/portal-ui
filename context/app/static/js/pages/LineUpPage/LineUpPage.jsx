import React, { useMemo } from 'react';
import LineUp, {
  LineUpStringColumnDesc,
  LineUpNumberColumnDesc,
  LineUpCategoricalColumnDesc,
  LineUpDateColumnDesc,
} from 'lineupjsx';
import 'lineupjsx/build/LineUpJSx.css';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import metadataFieldTypes from 'metadata-field-types';

function LineUpPage({ entities }) {
  const { dataKeys, normalizedEntities } = useMemo(() => {
    // Remove any `undefined` or `null` fields from the entities
    const cleanEntities = entities.map((entity) =>
      Object.fromEntries(Object.entries(entity).filter(([, value]) => value !== null && value !== undefined)),
    );
    // Get keys of first row
    const firstRow = cleanEntities[0];
    const entityKeys = Object.keys(firstRow);

    const errors = new Map();

    // Make sure entities have all necessary keys
    const completeEntities = cleanEntities.filter((entity) =>
      entityKeys.every((key) => {
        if (key in entity) {
          return true;
        }
        // Filter out and report entities that are missing keys in browser console
        errors.set(key, [...(errors.get(key) ?? []), entity.uuid]);
        return false;
      }),
    );

    if (errors.size > 0) {
      console.error('Entities with missing keys', Object.fromEntries(errors));
    }
    return { dataKeys: entityKeys, normalizedEntities: completeEntities };
  }, [entities]);

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
    <>
      <SectionHeader variant="h1" component="h1">
        LineUp
      </SectionHeader>
      <Paper>
        <LineUp data={normalizedEntities}>{columns}</LineUp>
      </Paper>
    </>
  );
}

export default LineUpPage;

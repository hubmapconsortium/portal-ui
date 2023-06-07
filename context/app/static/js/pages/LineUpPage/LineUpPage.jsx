import React from 'react';
import LineUp, {
  LineUpStringColumnDesc,
  LineUpNumberColumnDesc,
  LineUpCategoricalColumnDesc,
  LineUpDateColumnDesc,
} from 'lineupjsx';
import 'lineupjsx/build/LineUpJSx.css';
import Paper from '@mui/material/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import metadataFieldTypes from 'metadata-field-types';

function LineUpPage({ entities }) {
  const cleanEntities = entities.map((entity) =>
    Object.fromEntries(Object.entries(entity).filter(([, value]) => value !== null)),
  );
  const firstRow = cleanEntities[0];
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
  const columns = Object.keys(firstRow).map((key) => {
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
        <LineUp data={cleanEntities}>{columns}</LineUp>
      </Paper>
    </>
  );
}

export default LineUpPage;

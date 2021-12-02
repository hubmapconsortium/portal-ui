import React from 'react';
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

function LineUpPage(props) {
  const { entities } = props;
  const firstRow = entities[0];
  const notEnumFields = new Set([
    // Donors:
    'hubmap_id',
    'medical_history',
    'uuid',
    // Samples:
    'donor.hubmap_id',
    'sample_id',
    // Datasets:
    'description',
    'library_adapter_sequence',
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
        <LineUp data={entities}>{columns}</LineUp>
      </Paper>
    </>
  );
}

export default LineUpPage;

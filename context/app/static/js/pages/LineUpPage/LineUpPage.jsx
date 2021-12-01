import React from 'react';
import LineUp, { LineUpStringColumnDesc, LineUpNumberColumnDesc } from 'lineupjsx';
import 'lineupjsx/build/LineUpJSx.css';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import metadataFieldTypes from 'metadata-field-types';

function LineUpPage(props) {
  const { entities } = props;
  const firstRow = entities[0];
  const columns = Object.keys(firstRow).map((key) => {
    switch (metadataFieldTypes[key]) {
      case 'number':
        return <LineUpNumberColumnDesc column={key} />;
      default:
        return <LineUpStringColumnDesc column={key} />;
    }
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

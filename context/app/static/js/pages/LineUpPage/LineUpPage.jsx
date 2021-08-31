import React from 'react';
import LineUp from 'lineupjsx';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function LineUpPage(props) {
  const { entities } = props;

  return (
    <SectionContainer>
      <link href="https://unpkg.com/lineupjsx/build/LineUpJSx.css" rel="stylesheet" />
      {/* <Typography variant="subtitle1">Subtitle</Typography> */}
      <SectionHeader variant="h1" component="h1">
        LineUp
      </SectionHeader>
      <Paper>
        <LineUp data={entities} />
      </Paper>
    </SectionContainer>
  );
}

export default LineUpPage;

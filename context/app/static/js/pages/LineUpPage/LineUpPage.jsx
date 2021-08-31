import React from 'react';
import LineUp from 'lineupjsx';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function LineUpPage(props) {
  const { entities } = props;

  return (
    <SectionContainer>
      {/* <Typography variant="subtitle1">Subtitle</Typography> */}
      <SectionHeader variant="h1" component="h1">
        LineUp
      </SectionHeader>
      {/* <StyledDescription>
        Describe?
      </StyledDescription> */}
      <LineUp data={entities} />
    </SectionContainer>
  );
}

export default LineUpPage;

import React from 'react';

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
      <pre>{JSON.stringify(entities, null, 2)}</pre>
    </SectionContainer>
  );
}

export default LineUpPage;

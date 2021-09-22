import React from 'react';
import Typography from '@material-ui/core/Typography';

import Markdown from 'js/components/Markdown';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Publication(props) {
  const { vitData, title, markdown } = props;

  return (
    <>
      <SectionContainer>
        <Typography variant="subtitle1">Publication</Typography>
        <SectionHeader variant="h1" component="h1">
          {title}
        </SectionHeader>
      </SectionContainer>
      {Boolean(vitData) && <VisualizationWrapper vitData={vitData} />}
      <Markdown markdown={markdown} />
    </>
  );
}

export default Publication;

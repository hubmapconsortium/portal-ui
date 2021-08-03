import React from 'react';
import Typography from '@material-ui/core/Typography';

import Markdown from 'js/components/Markdown';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
// import { StyledDescription } from './style';

function Publication(props) {
  const { vitData, title, /* publicationMetadata, */ markdown } = props;

  // const { ... } = publicationMetadata;

  return (
    <>
      <SectionContainer id="summary">
        <Typography variant="subtitle1">Publication</Typography>
        <SectionHeader variant="h1" component="h1">
          {title}
        </SectionHeader>
        {/* Add description of Publications in general? */}
        <Markdown markdown={markdown} />
      </SectionContainer>
      {Boolean(vitData) && <VisualizationWrapper vitData={vitData} />}
    </>
  );
}

export default Publication;

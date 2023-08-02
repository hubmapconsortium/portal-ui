import React from 'react';
import Typography from '@mui/material/Typography';

import Markdown from 'js/components/Markdown';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Attribution from 'js/components/detailPage/Attribution';
import { StyledDescription } from './style';

function Preview({ vitData, title, assayMetadata, markdown }) {
  const { group_name, created_by_user_displayname, created_by_user_email } = assayMetadata;

  return (
    <>
      <SectionContainer>
        <Typography variant="subtitle1">Preview</Typography>
        <SectionHeader variant="h1" component="h1">
          {title}
        </SectionHeader>
        <StyledDescription>
          HuBMAP Data Portal Previews demonstrate functionality and resources that will become available in future
          releases. Previews may rely on externally hosted data or analysis results that were generated with processing
          pipelines that are not yet integrated into the HuBMAP Data Portal infrastructure.
        </StyledDescription>
        <Markdown markdown={markdown} />
      </SectionContainer>
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      {Boolean(vitData) && <VisualizationWrapper vitData={vitData} />}
    </>
  );
}

export default Preview;

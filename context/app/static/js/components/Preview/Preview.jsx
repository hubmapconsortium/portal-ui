import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import VisualizationWrapper from '../Detail/VisualizationWrapper';
import SectionHeader from '../Detail/SectionHeader';
import SectionContainer from '../Detail/SectionContainer';
import { StyledPaper, StyledMarkdown } from './style';
import Attribution from '../Detail/Attribution';
import Description from '../Detail/Description';

function Preview(props) {
  const { vitData, title, assayMetadata, markdown } = props;

  const { group_name, created_by_user_displayname, created_by_user_email } = assayMetadata;

  return (
    <Container maxWidth="lg">
      <SectionContainer id="summary">
        <Typography variant="h4" component="h1" color="primary">
          Preview
        </Typography>
        <SectionHeader variant="h1" component="h2">
          {title}
        </SectionHeader>
        <Description>
          HuBMAP Data Portal Previews demonstrate functionality and resources that will become available in future
          releases. Previews may rely on externally hosted data or analysis results that were generated with processing
          pipelines that are not yet integrated into the HuBMAP Data Portal infrastructure.
        </Description>
        <StyledPaper>
          <Typography variant="body1">
            <StyledMarkdown source={markdown} />
          </Typography>
        </StyledPaper>
      </SectionContainer>
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      {Boolean(vitData) && <VisualizationWrapper vitData={vitData} />}
    </Container>
  );
}

export default Preview;

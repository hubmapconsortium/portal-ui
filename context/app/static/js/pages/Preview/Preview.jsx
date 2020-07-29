import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import VisualizationWrapper from 'js/components/Detail/VisualizationWrapper';
import SectionHeader from 'js/components/Detail/SectionHeader';
import SectionContainer from 'js/components/Detail/SectionContainer';
import { StyledPaper } from 'js/components/Detail/Summary/style';
import Attribution from 'js/components/Detail/Attribution';
import { StyledMarkdown } from './style';

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
      <VisualizationWrapper vitData={vitData} />
    </Container>
  );
}

export default Preview;

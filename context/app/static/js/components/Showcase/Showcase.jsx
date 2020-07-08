import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ReactMarkdown from 'react-markdown';

import Visualization from '../Detail/Visualization';
import SectionHeader from '../Detail/SectionHeader';
import SectionContainer from '../Detail/SectionContainer';
import { StyledPaper } from '../Detail/Summary/style';
import Attribution from '../Detail/Attribution';

function Showcase(props) {
  const { vitData, title, assayMetadata, markdown } = props;

  const { group_name, created_by_user_displayname, created_by_user_email } = assayMetadata;

  return (
    <Container maxWidth="lg">
      <SectionContainer id="summary">
        <Typography variant="h4" component="h1" color="primary">
          Showcase
        </Typography>
        <SectionHeader variant="h1" component="h2">
          {title}
        </SectionHeader>

        <StyledPaper>
          <Typography variant="body1">
            <ReactMarkdown source={markdown} />
          </Typography>
        </StyledPaper>
      </SectionContainer>
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      <Visualization vitData={vitData} />
    </Container>
  );
}

export default Showcase;

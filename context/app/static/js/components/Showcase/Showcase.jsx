import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ReactMarkdown from 'react-markdown';

import Visualization from '../Detail/Visualization';
import SectionHeader from '../Detail/SectionHeader';
import SectionItem from '../Detail/SectionItem';
import SectionContainer from '../Detail/SectionContainer';
import { StyledPaper } from '../Detail/Summary/style';
import { FlexColumnRight, StyledTypography, StyledDivider } from './style';

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
          <StyledDivider orientation="vertical" flexItem />
          <FlexColumnRight>
            <StyledTypography variant="subtitle1">Creator</StyledTypography>
            <SectionItem label="Center">{group_name}</SectionItem>
            <SectionItem label="Email">{created_by_user_email}</SectionItem>
            <SectionItem label="Name">{created_by_user_displayname}</SectionItem>
          </FlexColumnRight>
        </StyledPaper>
      </SectionContainer>
      <Visualization vitData={vitData} />
    </Container>
  );
}

export default Showcase;

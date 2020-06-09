/* eslint-disable camelcase */
import React from 'react';
import Visualization from '../Detail/Visualization';
import SectionHeader from '../Detail/SectionHeader';
import SectionItem from '../Detail/SectionItem';
import SectionContainer from '../Detail/SectionContainer';
import { FlexRow, FlexColumn } from '../Detail/DetailLayout/style';
import { FlexColumnRight, StyledTypography, StyledPaper } from '../Detail/Summary/style';

function ShowcaseLayout(props) {
  const { children } = props;
  return (
    <FlexRow>
      <FlexColumn maxWidth="lg">{children}</FlexColumn>
    </FlexRow>
  );
}

function Showcase(props) {
  const { vitData, title, assayMetadata } = props;

  const { group_name, created_by_user_displayname, created_by_user_email, description } = assayMetadata;

  return (
    <ShowcaseLayout>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h2">
          {title}
        </SectionHeader>

        <StyledPaper>
          <StyledTypography variant="body1" mt={1}>
            {description}
          </StyledTypography>
          <FlexColumnRight>
            <SectionItem label="TMC">{group_name}</SectionItem>
            <SectionItem label="Contact">{created_by_user_email}</SectionItem>
            <SectionItem label="Name">{created_by_user_displayname}</SectionItem>
          </FlexColumnRight>
        </StyledPaper>
      </SectionContainer>
      <Visualization vitData={vitData} />
    </ShowcaseLayout>
  );
}

export default Showcase;

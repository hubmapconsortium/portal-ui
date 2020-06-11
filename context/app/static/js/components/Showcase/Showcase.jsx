/* eslint-disable camelcase */
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import Visualization from '../Detail/Visualization';
import SectionHeader from '../Detail/SectionHeader';
import SectionItem from '../Detail/SectionItem';
import SectionContainer from '../Detail/SectionContainer';
import { FlexRow, FlexColumn } from '../Detail/DetailLayout/style';
import { FlexColumnRight, StyledPaper } from '../Detail/Summary/style';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => (props.mb ? '5px' : '0px')};
  margin-left: ${(props) => (props.ml ? '10px' : '0px')};
  margin-top: ${(props) => (props.mt ? '5px' : '0px')};
`;

const StyledDivider = styled(Divider)`
  margin-left: 10px;
  margin-right: 10px;
`;

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
        <Typography variant="h4" component="h1" color="primary">
          Showcase
        </Typography>
        <SectionHeader variant="h1" component="h2">
          {title}
        </SectionHeader>

        <StyledPaper>
          <StyledTypography variant="body1" mt={1}>
            {description}
          </StyledTypography>
          <StyledDivider orientation="vertical" flexItem />
          <FlexColumnRight>
            <StyledTypography variant="subtitle1" mb={1}>
              Creator
            </StyledTypography>
            <SectionItem label="Center">{group_name}</SectionItem>
            <SectionItem label="Email">{created_by_user_email}</SectionItem>
            <SectionItem label="Name">{created_by_user_displayname}</SectionItem>
          </FlexColumnRight>
        </StyledPaper>
      </SectionContainer>
      <Visualization vitData={vitData} />
    </ShowcaseLayout>
  );
}

export default Showcase;

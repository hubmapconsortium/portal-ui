/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';

const LightText = styled.span`
  color: #444A65;
`;

const StyledLink = styled(Link)`
  color: #3781D1;
`;

const StyledPaper = styled(Paper)`
  padding: 20px 40px 20px 40px;
`;

function AttributionItem(props) {
  const { children, label } = props;
  return (
    <Typography variant="body1">
      <LightText>{label}</LightText>{children}
    </Typography>
  );
}
function Attribution(props) {
  const { assayMetadata } = props;
  const {
    group_name,
    created_by_user_displayname,
    created_by_user_email,
  } = assayMetadata;

  return (
    <SectionContainer id="attribution">
      <SectionHeader variant="h3" component="h2">Attribution</SectionHeader>
      <StyledPaper>
        <Typography variant="body1">{group_name}</Typography>
        <AttributionItem label="Created by: ">{created_by_user_displayname}</AttributionItem>
        <AttributionItem label="Email: ">
          <StyledLink href={`mailto:${created_by_user_email}`}>{created_by_user_email}</StyledLink>
        </AttributionItem>
      </StyledPaper>
    </SectionContainer>
  );
}

export default Attribution;

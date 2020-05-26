/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionItem from './SectionItem';
import SummaryItem from './SummaryItem';
import SectionContainer from './SectionContainer';

const FlexContainer = styled.div`
  display: flex;
`;

const ColumnContainer = styled(FlexContainer)`
  flex-direction: column;
`;

const FlexItemRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const FlexItemBottomRight = styled(FlexItemRight)`
  align-items: flex-end;
`;

const FlexColumnRight = styled(FlexItemRight)`
    flex-direction: column;
    justify-content: space-evenly;
`;

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => (props.ml ? '10px' : '0px')};
  margin-top: ${(props) => (props.mt ? '5px' : '0px')};
`;

const StyledLink = styled(Link)`
  color: #3781D1;
`;

const StyledPaper = styled(Paper)`
  display:flex;
  min-height:155px;
  padding: 30px 40px 30px 40px;
`;

function Summary(props) {
  const { assayMetadata, children } = props;
  const {
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    uuid,
    description,
    status,
  } = assayMetadata;


  return (
    <SectionContainer id="summary">
      <Typography variant="h4" component="h1" color="primary">{entity_type}</Typography>
      <FlexContainer>
        <ColumnContainer>
          <SectionHeader variant="h1" component="h2">{display_doi}</SectionHeader>
          {entity_type !== 'Donor'
            ? (
              <FlexContainer>
                {children}
              </FlexContainer>
            ) : null}
        </ColumnContainer>
        <FlexItemBottomRight>
          {status && status.length
            ? (
              <FlexContainer>
                <SummaryItem>{status}</SummaryItem>
              </FlexContainer>
            ) : null}
          <StyledLink
            href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`}
            variant="body1"
            target="_blank"
            ml={1}
          >
            JSON
          </StyledLink>
        </FlexItemBottomRight>
      </FlexContainer>

      <StyledPaper>
        <StyledTypography variant="body1" mt={1}>{description || 'No description defined'}</StyledTypography>
        <FlexColumnRight>
          <SectionItem label="Creation Date">{new Date(create_timestamp).toDateString()}</SectionItem>
          <SectionItem label="Modification Date">{new Date(last_modified_timestamp).toDateString()}</SectionItem>
        </FlexColumnRight>
      </StyledPaper>
    </SectionContainer>
  );
}

export default Summary;

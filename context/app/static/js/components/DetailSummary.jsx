/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionItem from './SectionItem';

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
  align-self: flex-end;
`;

const StyledDivider = styled(Divider)`
  margin-left: 5px;
  margin-right: 5px;
  height: 90%;
  background-color: #444A65;
  align-self:center;
`;

const StyledPaper = styled(Paper)`
  display:flex;
  min-height:155px;
  padding: 15px 40px 15px 15px;
`;

function AssaySpecificItem(props) {
  const { children } = props;
  return (
    <>
      <StyledDivider orientation="vertical" flexItem />
      <Typography variant="body1">{children}</Typography>
    </>
  );
}

function DetailSummary(props) {
  const { assayMetadata } = props;
  const {
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    uuid,
    description,
    organ_type,
    specimen_type,
    data_types,
    status,
  } = assayMetadata;


  return (
    <div>
      <Typography variant="h4" component="h1" color="primary">{entity_type}</Typography>
      <FlexContainer>
        <ColumnContainer>
          <SectionHeader variant="h1" component="h2">{display_doi}</SectionHeader>
          <FlexContainer>
            {organ_type && organ_type.length
              ? (<AssaySpecificItem>{organ_type}</AssaySpecificItem>) : null}
            {specimen_type && specimen_type.length
              ? (<AssaySpecificItem>{specimen_type}</AssaySpecificItem>) : null}
            {data_types && data_types.length
              ? (<AssaySpecificItem>{data_types.constructor.name === 'Array' ? data_types.join(' / ') : data_types}</AssaySpecificItem>) : null}
            {status && status.length
              ? (<AssaySpecificItem>{status}</AssaySpecificItem>) : null}
          </FlexContainer>
        </ColumnContainer>
        <FlexItemRight>
          <StyledLink
            href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`}
            variant="body1"
            target="_blank"
            ml={1}
          >
            JSON
          </StyledLink>
        </FlexItemRight>
      </FlexContainer>

      <StyledPaper>
        <StyledTypography variant="body1" mt={1}>{description || 'No description defined'}</StyledTypography>
        <FlexColumnRight>
          <SectionItem label="Creation Date">{new Date(create_timestamp).toDateString()}</SectionItem>
          <SectionItem label="Modification Date">{new Date(last_modified_timestamp).toDateString()}</SectionItem>
        </FlexColumnRight>
      </StyledPaper>
    </div>
  );
}

export default DetailSummary;

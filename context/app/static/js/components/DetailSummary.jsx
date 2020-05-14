/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

const FlexContainer = styled.div`
  display: flex;
`;

const FlexItemRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => (props.ml ? '10px' : '0px')};
  margin-top: ${(props) => (props.mt ? '5px' : '0px')};
`;

const StyledLink = styled(Link)`
  color: #3781D1;
`;

const StyledDivider = styled(Divider)`
  margin-left: 5px;
  margin-right: 5px;
  height: 90%;
  background-color: rgba(0, 0, 0, 0.87);
`;

const LightText = styled.span`
  color: rgba(0, 0, 0, 0.54);
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

function DateItem(props) {
  const { children, label } = props;
  return (
    <StyledTypography variant="body1" ml={1}>
      <LightText>{label}</LightText> {new Date(children).toDateString()}
    </StyledTypography>
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
    <>
      <Typography variant="h1" component="h1">{display_doi}</Typography>
      <FlexContainer>
        <FlexContainer>
          <Typography variant="body1">{entity_type}</Typography>
          {organ_type && organ_type.length
            ? (<AssaySpecificItem>{organ_type}</AssaySpecificItem>) : null}
          {specimen_type && specimen_type.length
            ? (<AssaySpecificItem>{specimen_type}</AssaySpecificItem>) : null}
          {data_types && data_types.length
            ? (<AssaySpecificItem>{data_types.constructor.name === 'Array' ? data_types.join(' / ') : data_types}</AssaySpecificItem>) : null}
          {status && status.length
            ? (<AssaySpecificItem>{status}</AssaySpecificItem>) : null}
        </FlexContainer>
        <FlexItemRight>
          <DateItem label="Created: ">{create_timestamp}</DateItem>
          <DateItem label="Modified: ">{last_modified_timestamp}</DateItem>
          <StyledDivider orientation="vertical" flexItem />
          <StyledLink
            href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`}
            variant="body1"
            component="button"
            download
            ml={1}
          >
            JSON
          </StyledLink>
        </FlexItemRight>
      </FlexContainer>
      <Divider />
      {description && description.length ? <StyledTypography variant="body1" mt={1}>{description}</StyledTypography> : null}
    </>
  );
}

export default DetailSummary;

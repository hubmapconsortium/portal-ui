import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {
  FlexContainer,
  FlexCenterAlign,
  FlexColumn,
  FlexBottomRight,
  FlexColumnRight,
  StyledTypography,
  JsonLink,
  StyledPaper,
} from './style';
import SectionHeader from '../SectionHeader';
import SectionItem from '../SectionItem';
import SummaryItem from '../SummaryItem';
import SectionContainer from '../SectionContainer';
import StatusIcon from '../StatusIcon';

function Summary(props) {
  const {
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    uuid,
    description,
    status,
    children,
    collectionName,
  } = props;

  const createdDate = create_timestamp ? new Date(create_timestamp).toDateString() : 'Undefined';
  const modifiedDate = last_modified_timestamp ? new Date(last_modified_timestamp).toDateString() : 'Undefined';

  return (
    <SectionContainer id="summary">
      <Typography variant="subtitle1" color="primary">
        {entity_type}
      </Typography>
      <FlexContainer>
        <FlexColumn>
          <SectionHeader variant="h1" component="h2">
            {display_doi}
          </SectionHeader>
          {entity_type !== 'Donor' && <FlexContainer>{children}</FlexContainer>}
        </FlexColumn>
        <FlexBottomRight>
          {entity_type === 'Dataset' && status && status.length > 0 && (
            <FlexCenterAlign>
              <StatusIcon status={status} />
              <SummaryItem>{status}</SummaryItem>
            </FlexCenterAlign>
          )}
          <JsonLink href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`} variant="body1" target="_blank" ml={1}>
            View JSON
          </JsonLink>
        </FlexBottomRight>
      </FlexContainer>

      <StyledPaper>
        <div>
          {collectionName && <Typography variant="subtitle1">{collectionName}</Typography>}
          <StyledTypography variant="body1" mt={1}>
            {description || 'No description defined'}
          </StyledTypography>
        </div>

        <FlexColumnRight>
          <SectionItem label="Creation Date">{createdDate}</SectionItem>
          <SectionItem label="Modification Date">{modifiedDate}</SectionItem>
        </FlexColumnRight>
      </StyledPaper>
    </SectionContainer>
  );
}

Summary.propTypes = {
  display_doi: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  create_timestamp: PropTypes.number.isRequired,
  last_modified_timestamp: PropTypes.number.isRequired,
  uuid: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string,
  children: PropTypes.element,
};

Summary.defaultProps = {
  description: '',
  status: '',
  children: undefined,
};

export default Summary;

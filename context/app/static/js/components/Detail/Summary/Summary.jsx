import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import {
  FlexContainer,
  FlexCenterAlign,
  FlexColumnRight,
  FlexRight,
  StyledPaper,
  StyledFileIcon,
  JsonButton,
  StyledDiv,
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
      <Typography variant="subtitle1" component="h1" color="primary">
        {entity_type}
      </Typography>
      <StyledDiv>
        <SectionHeader isSummary>{display_doi}</SectionHeader>
        <FlexCenterAlign>
          {entity_type !== 'Donor' && <FlexContainer>{children}</FlexContainer>}
          <FlexRight>
            {entity_type === 'Dataset' && status && status.length > 0 && (
              <FlexCenterAlign>
                <StatusIcon status={status} />
                <SummaryItem>{status}</SummaryItem>
              </FlexCenterAlign>
            )}
            <JsonButton href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`} target="_blank" component="a">
              <StyledFileIcon color="primary" />
            </JsonButton>
          </FlexRight>
        </FlexCenterAlign>
      </StyledDiv>

      <StyledPaper>
        <div>
          {collectionName && (
            <Typography color="primary" variant="subtitle1" component="p">
              {collectionName}
            </Typography>
          )}
          <Typography variant="body1">{description || 'No description defined'}</Typography>
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
  create_timestamp: PropTypes.number,
  last_modified_timestamp: PropTypes.number,
  uuid: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string,
  children: PropTypes.element,
};

Summary.defaultProps = {
  create_timestamp: undefined,
  last_modified_timestamp: undefined,
  description: '',
  status: '',
  children: undefined,
};

export default Summary;

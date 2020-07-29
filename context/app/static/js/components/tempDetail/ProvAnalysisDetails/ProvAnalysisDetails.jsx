/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import ProvAnalysisDetailsLink from '../ProvAnalysisDetailsLink';
import { StyledListItem } from './style';

function ProvAnalysisDetails(props) {
  const { dagListData } = props;
  return (
    <List>
      {dagListData.map((item, i) => (
        <React.Fragment key={`dag-provenance-list-item${i}`}>
          {i !== 0 && <Divider />}
          <StyledListItem>
            <ProvAnalysisDetailsLink data={item} />
          </StyledListItem>
        </React.Fragment>
      ))}
    </List>
  );
}
ProvAnalysisDetails.propTypes = {
  dagListData: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      name: PropTypes.string,
      origin: PropTypes.string,
    }),
  ).isRequired,
};

export default ProvAnalysisDetails;

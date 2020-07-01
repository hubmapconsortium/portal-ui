/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import DagProvLink from '../DagProvLink';
import { StyledListItem } from './style';

function DagProv(props) {
  const { dagListData } = props;
  return (
    <>
      <List>
        {dagListData.map((item, i) => (
          <React.Fragment key={`dag-provenance-list-item${i}`}>
            {i !== 0 && <Divider />}
            <StyledListItem>
              <DagProvLink data={item} />
            </StyledListItem>
          </React.Fragment>
        ))}
      </List>
    </>
  );
}
DagProv.propTypes = {
  dagListData: PropTypes.arrayOf(
    PropTypes.exact({
      hash: PropTypes.string,
      name: PropTypes.string,
      origin: PropTypes.string,
    }),
  ).isRequired,
};

export default DagProv;

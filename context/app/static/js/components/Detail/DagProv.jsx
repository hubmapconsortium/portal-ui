/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const ListKey = styled.span`
  font-weight: bold;
  margin-right: 4px;
`;

function DagProv(props) {
  const { dagListData } = props;
  return (
    <>
      <List>
        {dagListData.map((item, i) => (
          <React.Fragment key={`dag-provenance-list-item${i}`}>
            {i !== 0 && <Divider />}
            <li>
              {Object.entries(item).map(([key, value]) => (
                <Typography key={key} variant="body1">
                  <ListKey>{key}: </ListKey>
                  {value}
                </Typography>
              ))}
            </li>
          </React.Fragment>
        ))}
      </List>
    </>
  );
}
DagProv.propTypes = {
  dagListData: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      name: PropTypes.string,
      origin: PropTypes.string,
    }),
  ).isRequired,
};

export default DagProv;

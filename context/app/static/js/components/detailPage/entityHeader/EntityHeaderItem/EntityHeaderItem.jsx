import React from 'react';
import PropTypes from 'prop-types';

import { VerticalDivider, EntityName } from './style';

function EntityHeaderItem({ text }) {
  return (
    <>
      <EntityName variant="body1">{text}</EntityName>
      <VerticalDivider orientation="vertical" flexItem />
    </>
  );
}

EntityHeaderItem.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

EntityHeaderItem.defaultProps = {
  text: undefined,
};

export default EntityHeaderItem;

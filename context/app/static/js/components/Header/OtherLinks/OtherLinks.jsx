import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';

function OtherLinks(props) {
  const { isIndented } = props;
  return (
    <>
      <DropdownLink href="/collections" isIndented={isIndented}>
        Data Collections
      </DropdownLink>
      <DropdownLink href="/organ" isIndented={isIndented}>
        Organs
      </DropdownLink>
      {/* TODO: Add publications here, when ready. */}
    </>
  );
}

OtherLinks.propTypes = {
  isIndented: PropTypes.bool,
};

OtherLinks.defaultProps = {
  isIndented: false,
};

export default OtherLinks;

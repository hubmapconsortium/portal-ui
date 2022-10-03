import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'js/components/Providers';
import DropdownLink from '../DropdownLink';

function OtherLinks({ isIndented }) {
  const { groupsToken } = useContext(AppContext);
  const isLoggedIn = Boolean(groupsToken);

  return (
    <>
      <DropdownLink href="/collections" isIndented={isIndented}>
        Data Collections
      </DropdownLink>
      <DropdownLink href="/organ" isIndented={isIndented}>
        Organs
      </DropdownLink>
      {isLoggedIn && (
        <DropdownLink href="/cells" isIndented={isIndented}>
          Molecular Data Queries
        </DropdownLink>
      )}
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

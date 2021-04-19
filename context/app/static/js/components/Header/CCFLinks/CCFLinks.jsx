import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';

function CCFLinks(props) {
  const { isIndented } = props;
  return (
    <>
      <DropdownLink href="https://hubmapconsortium.github.io/ccf/" isIndented={isIndented}>
        Common Coordinate Framework (CCF) Portal
      </DropdownLink>
      <DropdownLink href="https://hubmapconsortium.github.io/ccf-asct-reporter/" isIndented={isIndented}>
        ASCT+B Reporter
      </DropdownLink>
      <DropdownLink href="https://portal.hubmapconsortium.org/ccf-eui" isIndented={isIndented}>
        Exploration User Interface (EUI)
      </DropdownLink>
      <DropdownLink href="https://hubmapconsortium.github.io/ccf-ui/rui/" isIndented={isIndented}>
        Registration User Interface (RUI)
      </DropdownLink>
    </>
  );
}

CCFLinks.propTypes = {
  isIndented: PropTypes.bool,
};

CCFLinks.defaultProps = {
  isIndented: false,
};

export default CCFLinks;

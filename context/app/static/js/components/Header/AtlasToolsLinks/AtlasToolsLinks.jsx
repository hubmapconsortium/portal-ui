import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';

function AtlasToolsLinks(props) {
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
      <StyledDivider />
      <DropdownLink href="https://azimuth.hubmapconsortium.org/" isIndented={isIndented}>
        Azimuth: Reference-based single cell mapping
      </DropdownLink>
    </>
  );
}

AtlasToolsLinks.propTypes = {
  isIndented: PropTypes.bool,
};

AtlasToolsLinks.defaultProps = {
  isIndented: false,
};

export default AtlasToolsLinks;

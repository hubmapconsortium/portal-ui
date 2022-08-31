import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';

function AtlasToolsLinks({ isIndented }) {
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
      <StyledDivider />
      <DropdownLink href="https://hubmapconsortium.github.io/hra-previews/pilots/pilot1.html" isIndented={isIndented}>
        HRA Preview: ASCT+B Reporter Comparison
      </DropdownLink>
      <DropdownLink href="https://hubmapconsortium.github.io/hra-previews/pilots/pilot2.html" isIndented={isIndented}>
        HRA Preview: Vasculature CCF Visualization
      </DropdownLink>
      <DropdownLink href="https://hubmapconsortium.github.io/hra-previews/pilots/pilot3.html" isIndented={isIndented}>
        HRA Preview: HRA vs. Experimental Data
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

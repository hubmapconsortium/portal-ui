import React from 'react';

import Paper from '@mui/material/Paper';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import { Flex, StyledInfoIcon } from '../style';
import { useLink, useScript } from './hooks';

interface HumanReferenceAtlasProps {
  uberonIri: string;
}

// Currently using staging site
const HRAOrganScript = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/organ-info/wc.js';
const HRAOrganStyles = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/organ-info/styles.css';

function HumanReferenceAtlas({ uberonIri }: HumanReferenceAtlasProps) {
  useScript(HRAOrganScript);
  useLink(HRAOrganStyles);
  return (
    <>
      <Flex>
        <SectionHeader>Human Reference Atlas</SectionHeader>
        <SecondaryBackgroundTooltip title="Atlas provided by the Common Coordinate Framework (CCF).">
          <StyledInfoIcon color="primary" />
        </SecondaryBackgroundTooltip>
      </Flex>
      <Paper>
        <ccf-organ-info
          organ-iri={uberonIri}
          use-remote-api="false"
          data-sources='["https://ccf-api.hubmapconsortium.org/v1/hubmap/rui_locations.jsonld"]'
        />
      </Paper>
    </>
  );
}

export default HumanReferenceAtlas;

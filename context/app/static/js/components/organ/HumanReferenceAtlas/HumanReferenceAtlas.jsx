import React from 'react';

import Paper from '@mui/material/Paper';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import { Flex, StyledInfoIcon } from '../style';

function HumanReferenceAtlas({ uberonIri }) {
  return (
    <>
      <Flex>
        <SectionHeader>Human Reference Atlas</SectionHeader>
        <SecondaryBackgroundTooltip title="Atlas provided by the Common Coordinate Framework (CCF).">
          <StyledInfoIcon color="primary" />
        </SecondaryBackgroundTooltip>
      </Flex>
      <Paper>
        <iframe
          style={{ border: 'none', width: '100%' }}
          title="Organ Info"
          src={`/iframe/organ?iri=${uberonIri}`}
          height="604"
          width="916"
          scrolling="no"
        />
      </Paper>
    </>
  );
}

export default HumanReferenceAtlas;

import React from 'react';

import Paper from '@mui/material/Paper';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import CCFOrganInfo from 'js/components/HRA/CCFOrganInfo';
import { Flex, StyledInfoIcon } from '../style';

interface HumanReferenceAtlasProps {
  uberonIri: string;
}

function HumanReferenceAtlas({ uberonIri }: HumanReferenceAtlasProps) {
  return (
    <>
      <Flex>
        <SectionHeader>Human Reference Atlas</SectionHeader>
        <SecondaryBackgroundTooltip title="Atlas provided by the Common Coordinate Framework (CCF).">
          <StyledInfoIcon color="primary" />
        </SecondaryBackgroundTooltip>
      </Flex>
      <Paper>
        <CCFOrganInfo uberonIri={uberonIri} />
      </Paper>
    </>
  );
}

export default HumanReferenceAtlas;

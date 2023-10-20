import React, { useEffect, useRef } from 'react';

import Paper from '@mui/material/Paper';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import reactifyWc from 'reactify-wc';

import { Typography } from '@mui/material';
import { Flex, StyledInfoIcon } from '../style';
import { useLink, useScript } from './hooks';
import { sampleData } from './sample-body-data';

interface HumanReferenceAtlasProps {
  uberonIri: string;
}

// Currently using staging site
const HRAOrganScript = 'https://hubmap-ccf-ui.netlify.app/organ-info/wc.js';
const HRAOrganStyles = 'https://hubmap-ccf-ui.netlify.app/organ-info/styles.css';
const HRAFonts = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&amp;display=swap';

// const HRABodyScript = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3.7/body-ui/wc.js';
// const HRABodyStyles = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3.7/body-ui/styles.css';

const CCFOrgan = reactifyWc('ccf-organ-info-wc');

const logEvent = (e: unknown) => console.log(e);
// const CCFOrgan = reactifyWc('ccf-organ-info');

function HumanReferenceAtlas({ uberonIri }: HumanReferenceAtlasProps) {
  useScript(HRAOrganScript);
  useLink(HRAOrganStyles);
  useLink(HRAFonts);
  // useEffect(() => {
  //   const setUpBodyUi = () => {
  //     const bodyUI = document.querySelector('ccf-body-ui-wc');
  //     if (!bodyUI) {
  //       console.log('retrying body ui');
  //       setTimeout(setUpBodyUi, 100);
  //       return;
  //     }
  //     // bodyUI.data = sampleData;
  //     // bodyUI.highlightID = '8cdf44a106338aada6da04c71eeb767e';
  //     // bodyUI.zoomToID = 'http://purl.org/ccf/latest/ccf.owl#VHFColon';

  //     console.log('Body UI WC loaded:', bodyUI, bodyUI.data);
  //   };
  //   setUpBodyUi();
  // }, []);
  return (
    <>
      <Flex>
        <SectionHeader>Human Reference Atlas</SectionHeader>
        <SecondaryBackgroundTooltip title="Atlas provided by the Common Coordinate Framework (CCF).">
          <StyledInfoIcon color="primary" />
        </SecondaryBackgroundTooltip>
      </Flex>
      <Paper>
        <Typography>
          {/* <CCFBody data={sampleData} onClick={logEvent} on-MouseEnter={logEvent} on-MouseLeave={logEvent} /> */}
        </Typography>
        <ccf-organ-info
          organ-iri={uberonIri}
          use-remote-api="false"
          data-sources='["https://ccf-api.hubmapconsortium.org/v1/hubmap/rui_locations.jsonld"]'
        />
        {/*
          This ended up having the same result as a direct import, but I'm leaving it here in case we need it later.
         */}
        {/* <CCFOrgan
          organ-iri={uberonIri}
          use-remote-api="false"
          data-sources='["https://ccf-api.hubmapconsortium.org/v1/hubmap/rui_locations.jsonld"]'
        /> */}
      </Paper>
    </>
  );
}

export default HumanReferenceAtlas;

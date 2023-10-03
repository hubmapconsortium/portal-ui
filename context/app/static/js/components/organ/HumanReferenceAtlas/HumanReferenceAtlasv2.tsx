import React, { useEffect, useRef } from 'react';

import Paper from '@mui/material/Paper';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
// import reactifyWc from 'reactify-wc';

import { Flex, StyledInfoIcon } from '../style';
import { useLink, useScript } from './hooks';

interface HumanReferenceAtlasProps {
  uberonIri: string;
}

const HRAOrganScript = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3.7/organ-info/wc.js';
const HRAOrganStyles = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3.7/organ-info/styles.css';
const HRAOrganFonts = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&amp;display=swap';

const logEvent = (e: unknown) => console.log(e);
// const CCFOrgan = reactifyWc('ccf-organ-info');

function HumanReferenceAtlas({ uberonIri }: HumanReferenceAtlasProps) {
  useScript(HRAOrganScript);
  useLink(HRAOrganStyles);
  useLink(HRAOrganFonts);
  useEffect(() => {
    const setUpCCFListeners = () => {
      const ccfOrgan = document.querySelector('ccf-organ');
      const ccfBody = document.querySelector('ccf-body-ui');
      if (!ccfOrgan || !ccfBody) {
        setTimeout(setUpCCFListeners, 100);
        console.log('waiting for ccf-organ/body to load');
        return;
      }
      console.log('ccf-organ/body loaded, attaching event listeners');
      ccfOrgan.addEventListener('sexChange', logEvent);
      ccfOrgan.addEventListener('sideChange', logEvent);
      ccfBody.addEventListener('nodeClick', logEvent);
    };
    setUpCCFListeners();
    return () => {
      const ccfOrgan = document.querySelector('ccf-organ');
      const ccfBody = document.querySelector('ccf-body-ui');
      if (ccfOrgan && ccfBody) {
        ccfOrgan.removeEventListener('sexChange', logEvent);
        ccfOrgan.removeEventListener('sideChange', logEvent);
        ccfBody.removeEventListener('nodeClick', logEvent);
      }
    };
  }, []);
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
        {/*
          This ended up having the same result as a direct import, but I'm leaving it here in case we need it later.
         <CCFOrgan
          organ-iri={uberonIri}
          use-remote-api="false"
          data-sources='["https://ccf-api.hubmapconsortium.org/v1/hubmap/rui_locations.jsonld"]'
        /> */}
      </Paper>
    </>
  );
}

export default HumanReferenceAtlas;

import React from 'react';

import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { StyledPaper, StyledTypography } from './style';

const paragraphs = [
  {
    key: 'intro',
    component: (
      <>
        The HuBMAP Data Portal allows access to both open and restricted access data and will be guided by the rules set
        by existing NIH GDH Policy and other applicable laws. There may be both controlled and uncontrolled access data
        available through the Data Portal. Permission to access controlled data will be reviewed and granted by a
        designated NIH Data Access Committee.
      </>
    ),
  },

  {
    key: 'users',
    component: (
      <>
        Users of HuBMAP open-data or processed data agree not to use the requested datasets, either alone or in concert
        with any other information, to identify or contact individual participants (or family members) from whom data
        and/or samples were collected.
      </>
    ),
  },

  {
    key: 'licenses',
    component: (
      <>
        All published HuBMAP data is licensed under a{' '}
        <OutboundLink href="https://creativecommons.org/licenses/by/4.0/">
          Creative Commons Attribution 4.0 International License (CC BY 4.0).
        </OutboundLink>{' '}
        Data is also governed by the{' '}
        <OutboundLink href="https://hubmapconsortium.org/policies/external-data-sharing-policy/">
          External Data Sharing Policy
        </OutboundLink>
        .
      </>
    ),
  },

  {
    key: 'fair-principles',
    component: (
      <>
        HuBMAP data is managed and published in the Data Portal and Human Reference Atlas according to{' '}
        <OutboundLink href="https://www.go-fair.org/fair-principles/">FAIR Principles</OutboundLink>, including
        standardized processing with reproducible pipelines. HuBMAP data may also be processed by other methods in
        scientific results published by HuBMAP consortium collaborations.
      </>
    ),
  },
  {
    key: 'help',
    component: (
      <>
        Please direct any questions to{' '}
        <EmailIconLink email="help@hubmapconsortium.org" iconFontSize="1.1rem">
          help@hubmapconsortium.org
        </EmailIconLink>
      </>
    ),
  },
];

function DataUseGuidelines() {
  return (
    <StyledPaper>
      {paragraphs.map(({ key, component }, i) => (
        <StyledTypography key={key} mt={i === 0 ? 1 : 2}>
          {component}
        </StyledTypography>
      ))}
    </StyledPaper>
  );
}

export default DataUseGuidelines;

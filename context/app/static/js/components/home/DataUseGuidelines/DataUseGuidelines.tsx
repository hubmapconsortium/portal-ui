import React from 'react';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import HomepageOutboundLink from 'js/components/home/HomepageOutboundLink';
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
        <HomepageOutboundLink href="https://creativecommons.org/licenses/by/4.0/">
          Creative Commons Attribution 4.0 International License (CC BY 4.0).
        </HomepageOutboundLink>{' '}
        Data is also governed by the{' '}
        <HomepageOutboundLink href="https://hubmapconsortium.org/policies/external-data-sharing-policy/">
          External Data Sharing Policy
        </HomepageOutboundLink>
        .
      </>
    ),
  },

  {
    key: 'fair-principles',
    component: (
      <>
        HuBMAP data is managed and published in the Data Portal and Human Reference Atlas according to{' '}
        <HomepageOutboundLink href="https://www.go-fair.org/fair-principles/">FAIR Principles</HomepageOutboundLink>,
        including standardized processing with reproducible pipelines. HuBMAP data may also be processed by other
        methods in scientific results published by HuBMAP consortium collaborations.
      </>
    ),
  },
  {
    key: 'help',
    component: (
      <>
        Please <ContactUsLink iconFontSize="1.1rem"> contact us with any questions</ContactUsLink>.
      </>
    ),
  },
];

function DataUseGuidelines() {
  return (
    <StyledPaper>
      {paragraphs.map(({ key, component }, i) => (
        <StyledTypography key={key} $mt={i === 0 ? 1 : 2}>
          {component}
        </StyledTypography>
      ))}
    </StyledPaper>
  );
}

export default DataUseGuidelines;

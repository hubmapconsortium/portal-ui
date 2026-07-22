import React from 'react';
import { trackEvent } from 'js/helpers/trackers';
import ContactUsLink, { contactUsUrl } from 'js/shared-styles/Links/ContactUsLink';
import HomepageOutboundLink from 'js/components/home/HomepageOutboundLink';
import { StyledPaper, StyledTypography } from './style';
import Typography from '@mui/material/Typography';

interface Paragraph {
  key: string;
  component: React.ReactNode;
  mt?: number;
}

const paragraphs: Paragraph[] = [
  {
    key: 'intro',
    component: (
      <>
        The HuBMAP Data Portal provides access to both open and restricted-access data, governed by existing NIH Genomic
        Data Sharing (GDS) Policy and other applicable laws. Both controlled- and open-access data may be available
        through the Data Portal. Access to controlled data requires review and approval by a designated NIH Data Access
        Committee.
      </>
    ),
  },

  {
    key: 'users',
    component: (
      <>
        Users of HuBMAP open or processed data agree not to use the requested datasets, alone or in combination with any
        other information, to identify or contact individual participants (or their family members) from whom the data
        or samples were collected.
      </>
    ),
  },

  {
    key: 'licenses',
    component: (
      <>
        All published HuBMAP data is licensed under a{' '}
        <HomepageOutboundLink href="https://creativecommons.org/licenses/by/4.0/">
          Creative Commons Attribution 4.0 International License (CC BY 4.0)
        </HomepageOutboundLink>{' '}
        and is further governed by the{' '}
        <HomepageOutboundLink href="https://hubmapconsortium.org/policies/external-data-sharing-policy/">
          External Data Sharing Policy
        </HomepageOutboundLink>
        . HuBMAP data is managed and published in the Data Portal and Human Reference Atlas in accordance with FAIR
        Principles, including standardized processing through reproducible pipelines; HuBMAP data may also be processed
        using other methods in scientific results published by HuBMAP consortium collaborations.
      </>
    ),
  },

  {
    key: 'cite-heading',
    component: <Typography variant="subtitle2">How to cite?</Typography>,
  },
  {
    key: 'cite',
    mt: 0.5,
    component: (
      <>
        Please cite the{' '}
        <HomepageOutboundLink href="https://arxiv.org/abs/2511.05708">HuBMAP Data Portal paper</HomepageOutboundLink>{' '}
        (preprint:{' '}
        <HomepageOutboundLink href="https://doi.org/10.48550/arXiv.2511.05708">
          https://doi.org/10.48550/arXiv.2511.05708
        </HomepageOutboundLink>
        ) when HuBMAP data were used in the study, portal tools were used in methods or analysis, or the portal is used
        as a data repository per journal requirements. See our{' '}
        <HomepageOutboundLink href="https://hubmapconsortium.org/acknowledgement-in-publications/">
          citation guidance
        </HomepageOutboundLink>{' '}
        for full details.
      </>
    ),
  },
  {
    key: 'help',
    component: (
      <>
        Please{' '}
        <ContactUsLink
          iconFontSize="1.1rem"
          onClick={() => trackEvent({ category: 'Homepage', action: 'Data Use Guidelines', label: contactUsUrl })}
        >
          {' '}
          contact us with any questions
        </ContactUsLink>
        .
      </>
    ),
  },
];

function DataUseGuidelines() {
  return (
    <StyledPaper>
      {paragraphs.map(({ key, component, mt }, i) => (
        <StyledTypography key={key} $mt={mt ?? (i === 0 ? 1 : 2)}>
          {component}
        </StyledTypography>
      ))}
    </StyledPaper>
  );
}

export default DataUseGuidelines;

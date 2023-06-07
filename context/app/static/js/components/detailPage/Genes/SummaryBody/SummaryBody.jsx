import React from 'react';
// import PropTypes from 'prop-types';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
// import Citation from 'js/components/detailPage/Citation';
// import { StyledTypography, Flex, StyledCreationDate, StyledModificationDate } from './style';

function SummaryBody() {
  return (
    <SummaryPaper>
      <LabelledSectionText label="Description" bottomSpacing={1}>
        Our best estimates show there are over 7 billion people on the planet and 300 billion stars in the Milky Way
        galaxy. By comparison, the adult human body contains 37 trillion cells. To determine the function and
        relationship among these cells is a monumental undertaking. Many areas of human health would be impacted if we
        better understand cellular activity. A problem with this much data is a great match for the Kaggle community.
        Just as the Human Genome Project mapped the entirety of human DNA, the Human BioMolecular Atlas Program (HuBMAP)
        is a major endeavor. Sponsored by the National Institutes of Health (NIH), HuBMAP is working to catalyze the
        development of a framework for mapping the human body at a level of glomerulus functional tissue units for the
        first time in history. Hoping to become one of the world’s largest collaborative biological projects, HuBMAP
        aims to be an open map of the human body at the cellular level.
      </LabelledSectionText>
      {/* {collectionName && (
        <StyledTypography variant="h6" component="h3">
          {collectionName}
        </StyledTypography>
      )}
      {description && (
        <LabelledSectionText label="Description" bottomSpacing={1}>
          {description}
        </LabelledSectionText>
      )}
      {doi && (
        <Citation
          contributors={contributors}
          citationTitle={citationTitle}
          created_timestamp={created_timestamp}
          doi_url={doi_url}
          doi={doi}
        />
      )} */}
      {/* <Flex>
        {published_timestamp ? (
          <StyledCreationDate label="Publication Date" timestamp={published_timestamp} />
        ) : (
          <StyledCreationDate label="Creation Date" timestamp={created_timestamp} />
        )}
        <StyledModificationDate label="Modification Date" timestamp={last_modified_timestamp} />
      </Flex> */}
    </SummaryPaper>
  );
}

export default SummaryBody;

import React from 'react';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

function SummaryBody() {
  return (
    <SummaryPaper>
      <LabelledSectionText label="Description" bottomSpacing={1}>
        {/* temporary hard coded text */}
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
    </SummaryPaper>
  );
}

export default SummaryBody;

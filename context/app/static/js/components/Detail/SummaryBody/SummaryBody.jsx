import React from 'react';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

function SummaryBody({ description, citation, createdTimestamp, modifiedTimestamp }) {
  return (
    <SummaryPaper>
      <LabelledSectionText label="Description">{description}</LabelledSectionText>
      <LabelledSectionText label="Citation">{citation}</LabelledSectionText>
      <LabelledSectionText label="Creation Date">{createdTimestamp}</LabelledSectionText>
      <LabelledSectionText label="Modification Date">{modifiedTimestamp}</LabelledSectionText>
    </SummaryPaper>
  );
}

export default SummaryBody;

import React from 'react';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import Citation from 'js/components/Detail/Citation';
import { Flex, StyledCreationDate, StyledModificationDate } from './style';

function SummaryBody({
  description,
  create_timestamp,
  last_modified_timestamp,
  contributors,
  citationTitle,
  doi_url,
  doi,
}) {
  return (
    <SummaryPaper>
      <LabelledSectionText label="Description" bottomSpacing={1}>
        {description}
      </LabelledSectionText>
      {doi && (
        <Citation
          contributors={contributors}
          citationTitle={citationTitle}
          createTimestamp={create_timestamp}
          doi_url={doi_url}
          doi={doi}
        />
      )}
      <Flex>
        <StyledCreationDate label="Creation Date" timestamp={create_timestamp} />
        <StyledModificationDate label="Modification Date" timestamp={last_modified_timestamp} />
      </Flex>
    </SummaryPaper>
  );
}

export default SummaryBody;

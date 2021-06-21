import React from 'react';
import PropTypes from 'prop-types';

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
      {description && (
        <LabelledSectionText label="Description" bottomSpacing={1}>
          {description}
        </LabelledSectionText>
      )}
      {doi && (
        <Citation
          contributors={contributors}
          citationTitle={citationTitle}
          create_timestamp={create_timestamp}
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

SummaryBody.propTypes = {
  create_timestamp: PropTypes.number.isRequired,
  last_modified_timestamp: PropTypes.number.isRequired,
  description: PropTypes.string,
  contributors: PropTypes.arrayOf(PropTypes.shape({ last_name: PropTypes.string, first_name: PropTypes.string })),
  citationTitle: PropTypes.string,
  doi_url: PropTypes.string,
  doi: PropTypes.string,
};

SummaryBody.defaultProps = {
  description: undefined,
  contributors: undefined,
  citationTitle: undefined,
  doi_url: undefined,
  doi: undefined,
};

export default SummaryBody;

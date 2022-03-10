import React from 'react';
import PropTypes from 'prop-types';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import Citation from 'js/components/detailPage/Citation';
import { StyledTypography, Flex, StyledCreationDate, StyledModificationDate } from './style';

function SummaryBody({
  description,
  collectionName,
  created_timestamp,
  published_timestamp,
  last_modified_timestamp,
  contributors,
  citationTitle,
  doi_url,
  doi,
}) {
  return (
    <SummaryPaper>
      {collectionName && (
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
      )}
      <Flex>
        {published_timestamp ? (
          <StyledCreationDate label="Publication Date" timestamp={published_timestamp} />
        ) : (
          <StyledCreationDate label="Creation Date" timestamp={created_timestamp} />
        )}
        <StyledModificationDate label="Modification Date" timestamp={last_modified_timestamp} />
      </Flex>
    </SummaryPaper>
  );
}

SummaryBody.propTypes = {
  created_timestamp: PropTypes.number.isRequired,
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

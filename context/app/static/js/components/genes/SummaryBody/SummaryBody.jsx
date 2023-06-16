import React from 'react';
import Typography from '@material-ui/core/Typography';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function SummaryBody({ geneSummary, NCBIgeneId, HUGOgeneId }) {
  return (
    <SummaryPaper>
      <LabelledSectionText label="Description" bottomSpacing={1} fontWeight={500}>
        <Typography variant="body2" component="p">
          {geneSummary}
        </Typography>
      </LabelledSectionText>
      <LabelledSectionText label="Known References" fontWeight={500}>
        <Typography variant="body2" component="p">
          <OutboundIconLink href={`https://www.ncbi.nlm.nih.gov/gene/${NCBIgeneId}`}>NCBI Gene</OutboundIconLink>
          <br />
          <OutboundIconLink href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:${HUGOgeneId}`}>
            HUGO HGNC: {HUGOgeneId}
          </OutboundIconLink>
        </Typography>
      </LabelledSectionText>
    </SummaryPaper>
  );
}

export default SummaryBody;

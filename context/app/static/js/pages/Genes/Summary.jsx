import React from 'react';
import Typography from '@material-ui/core/Typography';

import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useGeneData, useNCBIGeneId, useHUGOGeneId } from './hooks';

function SummaryBody({ geneSymbol }) {
  const geneSummary = useGeneData(geneSymbol);
  const NCBIgeneId = useNCBIGeneId(geneSymbol);
  const HUGOgeneId = useHUGOGeneId(geneSymbol);

  return (
    <DetailPageSection id="summary">
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
            <OutboundIconLink href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${HUGOgeneId}`}>
              HUGO {HUGOgeneId}
            </OutboundIconLink>
          </Typography>
        </LabelledSectionText>
      </SummaryPaper>
    </DetailPageSection>
  );
}

export default SummaryBody;

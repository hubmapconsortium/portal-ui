import React from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { useOrganContext } from 'js/components/organ/contexts';
import { OrganPageIds } from 'js/components/organ/types';

function Description() {
  const {
    organ: { description, uberon, uberon_short, asctb },
  } = useOrganContext();

  return (
    <DetailPageSection id={OrganPageIds.summaryId}>
      <DetailSectionPaper>
        <Stack spacing={1}>
          <Typography variant="body1">{description}</Typography>
          <Typography variant="body1">
            Uberon: <OutboundIconLink href={uberon}>{uberon_short}</OutboundIconLink>
          </Typography>
          {asctb && (
            <Typography variant="body1">
              Visit the{' '}
              <OutboundIconLink
                href={`https://hubmapconsortium.github.io/ccf-asct-reporter/vis?selectedOrgans=${asctb}&playground=false`}
              >
                ASCT+B Reporter
              </OutboundIconLink>
            </Typography>
          )}
        </Stack>
      </DetailSectionPaper>
    </DetailPageSection>
  );
}

export default withShouldDisplay(Description);

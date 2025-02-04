import React, { PropsWithChildren } from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import withShouldDisplay from 'js/helpers/withShouldDisplay';

interface DescriptionProps extends PropsWithChildren {
  uberonIri: string;
  uberonShort: string;
  asctbId?: string;
  id: string;
}

function Description({ children, uberonIri, uberonShort, asctbId, id }: DescriptionProps) {
  return (
    <DetailPageSection id={id}>
      <DetailSectionPaper>
        <Stack spacing={1}>
          <Typography variant="body1">{children}</Typography>
          <Typography variant="body1">
            Uberon: <OutboundIconLink href={uberonIri}>{uberonShort}</OutboundIconLink>
          </Typography>
          {asctbId && (
            <Typography variant="body1">
              Visit the{' '}
              <OutboundIconLink
                href={`https://hubmapconsortium.github.io/ccf-asct-reporter/vis?selectedOrgans=${asctbId}&playground=false`}
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

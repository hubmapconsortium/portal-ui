import React, { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import StatusIcon from 'js/components/detailPage/StatusIcon';
import { FlexEnd } from './style';

const datasetEntityTypes = ['Dataset', 'Support', 'Publication', 'Preprint'];
const publicationEntityTypes = ['Publication', 'Preprint'];

const entitiesWithStatus = datasetEntityTypes.concat(...publicationEntityTypes);

interface SummaryDataProps extends PropsWithChildren {
  entity_type: AllEntityTypes;
  entityTypeDisplay?: string;
  status?: string;
  mapped_data_access_level?: string;
  title?: string;
  mapped_external_group_name?: string;
  otherButtons?: React.ReactNode;
}

function SummaryData({
  entity_type,
  entityTypeDisplay,
  status,
  mapped_data_access_level,
  title,
  children,
  mapped_external_group_name,
  otherButtons,
}: SummaryDataProps) {
  const isPublication = publicationEntityTypes.includes(entity_type);
  const LeftTextContainer = isPublication ? React.Fragment : 'div';

  return (
    <Stack spacing={1}>
      <SummaryTitle data-testid="entity-type" entityIcon={entity_type}>
        {entityTypeDisplay ?? entity_type}
      </SummaryTitle>
      <SpacedSectionButtonRow
        leftText={
          <LeftTextContainer>
            <Typography component="h1" variant="h2" marginBottom={0.5} data-testid="entity-title">
              {title}
            </Typography>
            {children && <FlexEnd data-testid="summary-data-parent">{children}</FlexEnd>}
          </LeftTextContainer>
        }
        buttons={
          <>
            {entitiesWithStatus.includes(entity_type) && (
              <>
                <SummaryItem
                  showDivider={Boolean(mapped_external_group_name)}
                  statusIcon={<StatusIcon status={status ?? ''} />}
                >
                  {status} ({mapped_data_access_level ?? ''})
                </SummaryItem>
                {mapped_external_group_name && <SummaryItem>{mapped_external_group_name}</SummaryItem>}
              </>
            )}
            {otherButtons}
          </>
        }
      />
    </Stack>
  );
}

export default SummaryData;

import React, { PropsWithChildren } from 'react';
import SaveEditEntityButton from 'js/components/detailPage/SaveEditEntityButton';

import { AllEntityTypes, entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import StatusIcon from 'js/components/detailPage/StatusIcon';
import { ESEntityType } from 'js/components/types';
import { FlexEnd, StyledTypography, StyledSvgIcon, SummaryDataHeader } from './style';
import SummaryJSONButton from '../SummaryJSONButton';

const datasetEntityTypes = ['Dataset', 'Support', 'Publication', 'Preprint'];
const publicationEntityTypes = ['Publication', 'Preprint'];

const entitiesWithStatus = datasetEntityTypes.concat(...publicationEntityTypes);

interface SummaryDataProps extends PropsWithChildren {
  entity_type: AllEntityTypes;
  entityTypeDisplay?: string;
  uuid: string;
  status: string;
  mapped_data_access_level: string;
  title?: string;
  entityCanBeSaved?: boolean;
  mapped_external_group_name?: string;
  showJsonButton?: boolean;
  otherButtons?: React.ReactNode;
}

function SummaryData({
  entity_type,
  entityTypeDisplay,
  uuid,
  status,
  mapped_data_access_level,
  title,
  entityCanBeSaved = true,
  children,
  mapped_external_group_name,
  showJsonButton = true,
  otherButtons,
}: SummaryDataProps) {
  const isPublication = publicationEntityTypes.includes(entity_type);
  const LeftTextContainer = isPublication ? React.Fragment : 'div';

  return (
    <>
      <SummaryTitle data-testid="entity-type">
        <SummaryDataHeader>
          <StyledSvgIcon as={entityIconMap[entity_type]} color="primary" />
          {entityTypeDisplay ?? entity_type}
        </SummaryDataHeader>
      </SummaryTitle>
      <SpacedSectionButtonRow
        leftText={
          <LeftTextContainer>
            <StyledTypography variant="h2" data-testid="entity-title">
              {title}
            </StyledTypography>
            {children && <FlexEnd data-testid="summary-data-parent">{children}</FlexEnd>}
          </LeftTextContainer>
        }
        buttons={
          <FlexEnd>
            {entitiesWithStatus.includes(entity_type) && (
              <>
                <SummaryItem statusIcon={<StatusIcon status={status} />}>{status}</SummaryItem>
                <SummaryItem>{`${mapped_data_access_level} Access`}</SummaryItem>
                {mapped_external_group_name && <SummaryItem>{mapped_external_group_name}</SummaryItem>}
              </>
            )}
            <FlexEnd>
              {showJsonButton && <SummaryJSONButton entity_type={entity_type} uuid={uuid} />}
              {entityCanBeSaved && <SaveEditEntityButton uuid={uuid} entity_type={entity_type as ESEntityType} />}
            </FlexEnd>
            {otherButtons}
          </FlexEnd>
        }
      />
    </>
  );
}

export default SummaryData;

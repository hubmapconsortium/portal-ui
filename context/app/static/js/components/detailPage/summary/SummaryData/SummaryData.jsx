import React from 'react';
import PropTypes from 'prop-types';
import SaveEditEntityButton from 'js/components/detailPage/SaveEditEntityButton';

import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { FileIcon } from 'js/shared-styles/icons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import VersionSelect from 'js/components/detailPage/VersionSelect';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import StatusIcon from 'js/components/detailPage/StatusIcon';
import { FlexEnd, JsonButton, StyledTypography, StyledSvgIcon, SummaryDataHeader } from './style';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';

const datasetEntityTypes = ['Dataset', 'Support', 'Publication', 'Preprint'];
const publicationEntityTypes = ['Publication', 'Preprint'];

const entitiesWithStatus = datasetEntityTypes.concat(...publicationEntityTypes);

function SummaryData({
  entity_type,
  entityTypeDisplay,
  uuid,
  status,
  mapped_data_access_level,
  title,
  entityCanBeSaved,
  children,
  mapped_external_group_name,
  showJsonButton = true,
  otherButtons,
}) {
  const isPublication = publicationEntityTypes.includes(entity_type);
  const LeftTextContainer = isPublication ? React.Fragment : 'div';

  const trackEntityPageEvent = useTrackEntityPageEvent();

  return (
    <>
      <SummaryTitle data-testid="entity-type">
        <SummaryDataHeader>
          <StyledSvgIcon component={entityIconMap[entity_type]} color="primary" />
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
              {showJsonButton && (
                <SecondaryBackgroundTooltip title="View JSON">
                  <JsonButton
                    href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`}
                    target="_blank"
                    component="a"
                    onClick={() => trackEntityPageEvent({ action: 'View JSON' })}
                  >
                    <FileIcon color="primary" />
                  </JsonButton>
                </SecondaryBackgroundTooltip>
              )}
              {entityCanBeSaved && <SaveEditEntityButton uuid={uuid} entity_type={entity_type} />}
              {datasetEntityTypes.includes(entity_type) && <VersionSelect uuid={uuid} />}
            </FlexEnd>
            {otherButtons}
          </FlexEnd>
        }
      />
    </>
  );
}

SummaryData.propTypes = {
  title: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  mapped_data_access_level: PropTypes.string.isRequired,
  entityCanBeSaved: PropTypes.bool,
  mapped_external_group_name: PropTypes.string,
};

SummaryData.defaultProps = {
  entityCanBeSaved: true,
  mapped_external_group_name: undefined,
};

export default SummaryData;

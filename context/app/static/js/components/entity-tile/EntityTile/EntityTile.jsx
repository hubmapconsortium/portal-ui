import React from 'react';
import format from 'date-fns/format';

import EntityTileBodyText from '../EntityTileBodyText';

import {
  StyledDatasetIcon,
  StyledSampleIcon,
  StyledDonorIcon,
  StyledPaper,
  HoverOverlay,
  FixedWidthFlex,
  BottomSection,
  BottomSectionDivider,
  BottomSectionText,
  BottomDatasetIcon,
  BottomSampleIcon,
} from './style';

function EntityTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, entityData, descendantCounts } = props;

  return (
    <a href={`/browse/${entity_type.toLowerCase()}/${uuid}`}>
      <StyledPaper $isCurrentEntity={isCurrentEntity}>
        <HoverOverlay $isCurrentEntity={isCurrentEntity}>
          <FixedWidthFlex>
            {entity_type === 'Dataset' && <StyledDatasetIcon $isCurrentEntity={isCurrentEntity} />}
            {entity_type === 'Donor' && <StyledDonorIcon $isCurrentEntity={isCurrentEntity} />}
            {entity_type === 'Sample' && <StyledSampleIcon $isCurrentEntity={isCurrentEntity} />}
            <EntityTileBodyText
              entity_type={entity_type}
              id={id}
              isCurrentEntity={isCurrentEntity}
              entityData={entityData}
            />
          </FixedWidthFlex>
          <BottomSection $isCurrentEntity={isCurrentEntity}>
            {Object.entries(descendantCounts).map(([k, v]) => (
              <>
                {k === 'Dataset' ? <BottomDatasetIcon /> : <BottomSampleIcon />}
                <BottomSectionText variant="body2">{v}</BottomSectionText>
                <BottomSectionDivider flexItem orientation="vertical" />
              </>
            ))}
            <BottomSectionText variant="body2" $isCurrentEntity={isCurrentEntity}>
              Modified {format(entityData.last_modified_timestamp, 'MM-dd-yyyy')}
            </BottomSectionText>
          </BottomSection>
        </HoverOverlay>
      </StyledPaper>
    </a>
  );
}

export default EntityTile;

/* eslint-disable react/no-array-index-key */
import React from 'react';
import Typography from '@mui/material/Typography';

import { useFlaskDataContext } from 'js/components/Contexts';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { FlexContainer, FlexColumn, TableColumn, StyledSvgIcon, ProvTableEntityHeader } from './style';
import ProvTableTile from '../ProvTableTile';
import ProvTableDerivedLink from '../ProvTableDerivedLink';

function ProvTable() {
  // Make a new list rather modifying old one in place: Caused duplication in UI.
  const { entity: assayMetadata } = useFlaskDataContext();
  const { ancestors, uuid } = assayMetadata;
  const ancestorsAndSelf = [...ancestors, assayMetadata];

  const ancestorsAndSelfByType = ancestorsAndSelf.reduce(
    (acc, entity) => {
      if (acc?.[entity.entity_type]) {
        acc[entity.entity_type].push(entity);
      }
      return acc;
    },
    { Donor: [], Sample: [], Dataset: [] },
  );

  const descendantEntityCounts = assayMetadata.descendant_counts.entity_type || {};
  const trackEntityPageEvent = useTrackEntityPageEvent();

  return (
    <FlexContainer>
      {Object.entries(ancestorsAndSelfByType).map(([type, entities]) => (
        <TableColumn key={`provenance-list-${type.toLowerCase()}`}>
          <ProvTableEntityHeader>
            <StyledSvgIcon component={entityIconMap[type]} color="primary" />
            <Typography variant="h5">{type}s</Typography>
          </ProvTableEntityHeader>
          <FlexColumn>
            {entities.length > 0 &&
              entities
                .sort((a, b) => a.created_timestamp - b.created_timestamp)
                .map((item, j, items) => (
                  <ProvTableTile
                    key={item.uuid}
                    uuid={item.uuid}
                    id={item.hubmap_id}
                    entity_type={item.entity_type}
                    isCurrentEntity={uuid === item.uuid}
                    isSampleSibling={
                      j > 0 && item.entity_type === 'Sample' && items[j - 1]?.sample_category === item.sample_category
                    }
                    isFirstTile={j === 0}
                    isLastTile={j === type.length - 1}
                    onClick={() =>
                      trackEntityPageEvent({ action: 'Provenance / Table / Select Card', label: item.hubmap_id })
                    }
                  />
                ))}
            {descendantEntityCounts?.[type] && <ProvTableDerivedLink uuid={uuid} type={type} />}
          </FlexColumn>
        </TableColumn>
      ))}
    </FlexContainer>
  );
}

export default ProvTable;

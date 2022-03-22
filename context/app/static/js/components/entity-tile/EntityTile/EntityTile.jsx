import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'js/components/Providers';
import EntityTileFooter from '../EntityTileFooter';
import EntityTileBody from '../EntityTileBody';
import { StyledPaper, Flex, LetterboxedThumbnail } from './style';

function EntityTile({ uuid, entity_type, id, invertColors, entityData, descendantCounts }) {
  const { thumbnail_file } = entityData;
  const { assetsEndpoint } = useContext(AppContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <a href={`/browse/${entity_type.toLowerCase()}/${uuid}`}>
      <StyledPaper $invertColors={invertColors}>
        <Flex>
          <EntityTileBody entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
          {thumbnail_file && (
            <LetterboxedThumbnail
              src={`${assetsEndpoint}/${thumbnail_file.file_uuid}/thumbnail.jpg`}
              alt={`${entity_type} ${id} thumbnail`}
              onLoad={() => setImageLoaded(true)}
              $shouldDisplayImage={imageLoaded}
            />
          )}
        </Flex>
        <EntityTileFooter invertColors={invertColors} entityData={entityData} descendantCounts={descendantCounts} />
      </StyledPaper>
    </a>
  );
}

EntityTile.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  uuid: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  descendantCounts: PropTypes.shape({ Dataset: PropTypes.number, Sample: PropTypes.number }),
  invertColors: PropTypes.bool,
};

EntityTile.defaultProps = {
  descendantCounts: {},
  invertColors: false,
};

export default EntityTile;

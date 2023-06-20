import React, { useState } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { LetterboxedThumbnail } from './style';

function EntityTileThumbnail({ thumbnail_file, entity_type, id, thumbnailDimension }) {
  const { assetsEndpoint } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <LetterboxedThumbnail
      src={`${assetsEndpoint}/${thumbnail_file.file_uuid}/thumbnail.jpg`}
      alt={`${entity_type} ${id} thumbnail`}
      onLoad={() => setImageLoaded(true)}
      $shouldDisplayImage={imageLoaded}
      $thumbnailDimension={thumbnailDimension}
    />
  );
}

export default EntityTileThumbnail;

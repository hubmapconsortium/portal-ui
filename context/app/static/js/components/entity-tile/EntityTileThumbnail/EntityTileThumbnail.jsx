import React, { useContext, useState } from 'react';

import { AppContext } from 'js/components/Providers';
import { LetterboxedThumbnail } from './style';

function EntityTileThumbnail({ thumbnail_file, entity_type, id, thumbnailDimension }) {
  const { assetsEndpoint } = useContext(AppContext);
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

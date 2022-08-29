import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import GlobusLink from '../GlobusLink';

function GlobusSection({ uuid, hubmap_id, visLiftedUUID }) {
  return (
    <DetailSectionPaper>
      <GlobusLink uuid={uuid} hubmap_id={hubmap_id} />
      {visLiftedUUID && <GlobusLink uuid={visLiftedUUID} isSupport />}
    </DetailSectionPaper>
  );
}

export default GlobusSection;

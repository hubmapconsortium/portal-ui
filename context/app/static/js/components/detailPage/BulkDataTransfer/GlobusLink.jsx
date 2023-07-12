import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { useFlaskDataContext, useFilesContext } from 'js/components/Contexts';
import FilesConditionalLink from './FilesConditionalLink';
import { StyledExternalLinkIcon } from './style';
import { useFetchProtectedFile } from './hooks';

function GlobusLink({ uuid, isSupport }) {
  const {
    entity: { hubmap_id },
  } = useFlaskDataContext();

  const { status, responseUrl } = useFetchProtectedFile(uuid);
  const { hasAgreedToDUA, openDUA } = useFilesContext();

  if (!status) {
    return <DetailSectionPaper>Loading...</DetailSectionPaper>;
  }

  return (
    <DetailSectionPaper>
      {isSupport && 'Support Dataset: '}
      <FilesConditionalLink
        href={responseUrl}
        hasAgreedToDUA={hasAgreedToDUA}
        openDUA={() => openDUA(responseUrl)}
        variant="body2"
      >
        {isSupport ? '' : hubmap_id} Globus <StyledExternalLinkIcon />
      </FilesConditionalLink>
    </DetailSectionPaper>
  );
}

function GlobusLinkContainer() {
  const {
    entity: { uuid },
    vis_lifted_uuid,
  } = useFlaskDataContext();

  return (
    <>
      <GlobusLink uuid={uuid} />
      {vis_lifted_uuid && <GlobusLink uuid={vis_lifted_uuid} isSupport />}
    </>
  );
}

export default GlobusLinkContainer;

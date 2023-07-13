import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useFilesContext } from 'js/components/detailPage/files/Files/context';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import FilesConditionalLink from './FilesConditionalLink';
import { StyledExternalLinkIcon, GlobusLinks } from './style';
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
        {isSupport ? '' : hubmap_id} Globus
        <SecondaryBackgroundTooltip title="Data generated for visualization of this dataset are also available on Globus.">
          <StyledExternalLinkIcon />
        </SecondaryBackgroundTooltip>
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
    <GlobusLinks>
      <GlobusLink uuid={uuid} />
      {vis_lifted_uuid && <GlobusLink uuid={vis_lifted_uuid} isSupport />}
    </GlobusLinks>
  );
}

export default GlobusLinkContainer;

import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { useFilesContext } from 'js/components/detailPage/files/FilesContext';
import FilesConditionalLink from './FilesConditionalLink';
import { LinkContainer } from './style';
import { useFetchProtectedFile } from './hooks';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';

interface GlobusLinkProps {
  uuid: string;
  hubmap_id: string;
  label: string;
}

function GlobusLink({ uuid, hubmap_id, label }: GlobusLinkProps) {
  const { status, responseUrl } = useFetchProtectedFile(uuid);
  const { hasAgreedToDUA, openDUA } = useFilesContext();
  const trackEntityPageEvent = useTrackEntityPageEvent();

  if (!status) {
    return <DetailSectionPaper>Loading...</DetailSectionPaper>;
  }

  return (
    <LinkContainer>
      <FilesConditionalLink
        href={responseUrl}
        hasAgreedToDUA={hasAgreedToDUA}
        openDUA={() => (responseUrl ? openDUA(responseUrl) : undefined)}
        variant="subtitle2"
        hasIcon
        fileName={`${label} (${hubmap_id})`}
        onClick={() => trackEntityPageEvent({ action: 'Bulk Data Transfer / Globus Navigation' })}
      />
    </LinkContainer>
  );
}

export default GlobusLink;

import React, { PropsWithChildren } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useFilesContext } from 'js/components/detailPage/files/FilesContext';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import FilesConditionalLink from './FilesConditionalLink';
import { LinkContainer } from './style';
import { useFetchProtectedFile } from './hooks';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';

interface WrapperComponentProps extends PropsWithChildren {
  isSupport: boolean;
}

function WrapperComponent({ isSupport, children }: WrapperComponentProps) {
  if (isSupport) {
    return (
      <SecondaryBackgroundTooltip title="Data generated for visualization of this dataset are also available on Globus.">
        <div>
          {isSupport && (
            <Typography variant="subtitle2" component="span">
              {'Support Dataset: '}
            </Typography>
          )}
          {children}
        </div>
      </SecondaryBackgroundTooltip>
    );
  }

  return children;
}

interface GlobusLinkProps {
  uuid: string;
  isSupport?: boolean;
}

function GlobusLink({ uuid, isSupport = false }: GlobusLinkProps) {
  const {
    entity: { hubmap_id },
  } = useFlaskDataContext();

  const { status, responseUrl } = useFetchProtectedFile(uuid);
  const { hasAgreedToDUA, openDUA } = useFilesContext();
  const trackEntityPageEvent = useTrackEntityPageEvent();

  if (!status) {
    return <DetailSectionPaper>Loading...</DetailSectionPaper>;
  }

  return (
    <LinkContainer>
      <WrapperComponent isSupport={isSupport}>
        <FilesConditionalLink
          href={responseUrl}
          hasAgreedToDUA={hasAgreedToDUA}
          openDUA={() => (responseUrl ? openDUA(responseUrl) : undefined)}
          variant="subtitle2"
          hasIcon
          fileName={`${hubmap_id} ${'Globus'}`}
          onClick={() => trackEntityPageEvent({ action: 'Bulk Data Transfer / Globus Navigation' })}
        />
      </WrapperComponent>
    </LinkContainer>
  );
}

function GlobusLinkContainer() {
  const {
    entity: { uuid },
    vis_lifted_uuid,
  } = useFlaskDataContext();

  return (
    <Stack key={uuid} divider={<Divider />}>
      <GlobusLink uuid={uuid} key={uuid} />
      {vis_lifted_uuid && <GlobusLink uuid={vis_lifted_uuid} key={vis_lifted_uuid} isSupport />}
    </Stack>
  );
}

export default GlobusLinkContainer;

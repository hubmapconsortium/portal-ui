import React from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import useProtocolData, { useFormattedProtocolUrls } from 'js/hooks/useProtocolData';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import Divider from '@mui/material/Divider';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { StyledPaper } from './style';
import SectionItem from '../SectionItem';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';

const loadingText = 'Protocols are loading. If protocols take a significant time to load, please ';
const errorText = 'Failed to retrieve protocols. Please ';

interface ProtocolMessageProps {
  isLoading?: boolean;
  isError?: boolean;
}

function ProtocolMessage({ isLoading, isError }: ProtocolMessageProps) {
  return (
    <SectionItem>
      {/* Extra `div` wrapper is necessary to prevent the email icon link from taking up the full width and breaking text. */}
      <div>
        {isLoading && loadingText}
        {isError && errorText}
        <ContactUsLink /> about this issue and mention the HuBMAP ID.
      </div>
    </SectionItem>
  );
}

interface ProtocolLinkProps {
  url: string;
  index: number;
}

function ProtocolLink({ url, index }: ProtocolLinkProps) {
  const { isLoading, data, error } = useProtocolData(url);

  const trackEntityPageEvent = useTrackEntityPageEvent();
  const hubmapId = useFlaskDataContext().entity.hubmap_id;

  if (isLoading) {
    if (index !== 0) {
      // Only show loading message for first protocol link
      return null;
    }
    return <ProtocolMessage isLoading />;
  }

  if (error) {
    return <ProtocolMessage isError />;
  }

  return (
    <SectionItem label={data?.payload?.title}>
      {data?.payload && (
        <OutboundIconLink
          onClick={() => trackEntityPageEvent({ action: 'Protocols / Protocol Link Navigation', label: hubmapId })}
          href={data.payload.url}
        >
          {data.payload.url}
        </OutboundIconLink>
      )}
    </SectionItem>
  );
}

interface ProtocolProps {
  protocol_url: string;
  showHeader?: boolean;
}

function Protocol({ protocol_url, showHeader }: ProtocolProps) {
  const protocolUrls = useFormattedProtocolUrls(protocol_url, 1);

  const contents = (
    <>
      {protocolUrls.map((url, index) => (
        <ProtocolLink key={url} url={url} index={index} />
      ))}
    </>
  );

  if (showHeader) {
    return (
      <CollapsibleDetailPageSection id="protocols" title="Protocols" icon={sectionIconMap.analysis}>
        <Divider />
        <StyledPaper>{contents}</StyledPaper>
      </CollapsibleDetailPageSection>
    );
  }
  return contents;
}

export default React.memo(Protocol);

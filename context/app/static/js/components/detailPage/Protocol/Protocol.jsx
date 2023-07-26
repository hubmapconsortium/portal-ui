import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import useProtocolData, { useFormattedProtocolUrls } from 'js/hooks/useProtocolData';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import HelpLink from 'js/shared-styles/Links/HelpLink';
import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledPaper } from './style';
import SectionItem from '../SectionItem';

function ProtocolMessage({ precedingText }) {
  return (
    <SectionItem>
      <div>
        {precedingText}
        <HelpLink /> about this issue and mention the HuBMAP ID.
      </div>
    </SectionItem>
  );
}

function ProtocolLink({ url, index }) {
  const { isLoading, data, error } = useProtocolData(url);

  if (error || isLoading || !data) {
    if (index !== 0) {
      // Only show loading message for first protocol link
      return null;
    }

    if (isLoading && !error) {
      // Extra `div` wrapper is necessary to prevent the email icon link from taking up the full width and breaking text
      return (
        <ProtocolMessage precedingText="Protocols are loading. If protocols take a significant time to load, please contact " />
      );
    }

    return <ProtocolMessage precedingText="Failed to retrieve protocols. Please contact " />;
  }

  return (
    <SectionItem label={data?.payload?.title}>
      <OutboundIconLink href={data?.payload?.url}>{data?.payload?.url}</OutboundIconLink>
    </SectionItem>
  );
}

function Protocol({ protocol_url }) {
  const protocolUrls = useFormattedProtocolUrls(protocol_url, 1);

  return (
    <DetailPageSection id="protocols">
      <SectionHeader>Protocols</SectionHeader>
      <Divider />
      <StyledPaper>
        {protocolUrls.map((url, index) => (
          <ProtocolLink key={url} url={url} index={index} />
        ))}
      </StyledPaper>
    </DetailPageSection>
  );
}

Protocol.propTypes = {
  protocol_url: PropTypes.string,
};

Protocol.defaultProps = {
  protocol_url: '',
};

export default React.memo(Protocol);

import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import useProtocolData, { useFormattedProtocolUrls } from 'js/hooks/useProtocolData';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledPaper } from './style';
import SectionItem from '../SectionItem';

function ProtocolLink({ url }) {
  const { loading, data, error } = useProtocolData(url);
  if (error) {
    <SectionItem label="Error loading protocol info">
      This protocol may be private or otherwise inaccessible.
    </SectionItem>;
  }
  if (loading || !data) {
    <SectionItem label="Loading protocol info">Please wait...</SectionItem>;
  }
  console.log(data?.payload);
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
        {protocolUrls.map((url) => (
          <ProtocolLink key={url} url={url} />
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

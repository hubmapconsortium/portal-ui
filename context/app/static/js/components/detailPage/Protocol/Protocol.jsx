import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';

import { useFlaskDataContext } from 'js/components/Contexts';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import useProtocolData, { useFormattedProtocolUrls } from 'js/hooks/useProtocolData';
import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledSectionHeader, StyledPaper } from './style';
import SectionItem from '../SectionItem';

function ProtocolLink({ url, index }) {
  const { loading, data, error } = useProtocolData(url);
  if (error || loading || !data) {
    if (index !== 0) {
      // Only show loading message for first protocol link
      return null;
    }
    // Extra `div` wrapper is necessary to prevent the email icon link from taking up the full width and breaking text
    return (
      <SectionItem>
        <div>
          Protocols are loading. If protocols take a significant time to load, please contact{' '}
          <EmailIconLink email="help@hubmapconsortium.org">help@hubmapconsortium.org</EmailIconLink> about this issue
          and mention the HuBMAP ID.
        </div>
      </SectionItem>
    );
  }
  return (
    <SectionItem label={data?.payload?.title}>
      <OutboundIconLink href={data?.payload?.url}>{data?.payload?.url}</OutboundIconLink>
    </SectionItem>
  );
}

function Protocol({ protocol_url }) {
  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  const tooltipTexts = {
    Donor: 'Protocols provided by protocol.io for the given donor.',
    Sample: 'Protocols provided by protocol.io for the given sample.',
    Dataset: 'Protocols provided by protocol.io for the given dataset.',
  };

  const protocolUrls = useFormattedProtocolUrls(protocol_url, 1);

  return (
    <DetailPageSection id="protocols">
      <StyledSectionHeader>
        Protocols
        <SecondaryBackgroundTooltip title={tooltipTexts[entity_type]}>
          <InfoIcon fontSize="small" color="primary" />
        </SecondaryBackgroundTooltip>
      </StyledSectionHeader>
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

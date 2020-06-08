/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { StyledTypography, StyledLink, StyledPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionItem from '../SectionItem';
import SectionContainer from '../SectionContainer';

function ProtocolLink(props) {
  const { protocolUrl: urlMinusProtocol } = props;
  return (
    <SectionItem label="Protocol URL">
      <StyledTypography variant="body1">
        {urlMinusProtocol ? (
          <StyledLink href={`https://${encodeURI(urlMinusProtocol)}`} target="_blank" rel="noopener noreferrer">
            {urlMinusProtocol}
          </StyledLink>
        ) : (
          'No URL Available'
        )}
      </StyledTypography>
    </SectionItem>
  );
}

function Protocol(props) {
  const { protocol_url, portal_uploaded_protocol_files } = props;

  return (
    <SectionContainer id="protocols">
      <SectionHeader variant="h3" component="h2">
        Protocols
      </SectionHeader>
      <Divider />
      <StyledPaper>
        <ProtocolLink protocolUrl={protocol_url} />
        {portal_uploaded_protocol_files &&
          portal_uploaded_protocol_files.map((protocol, i) => (
            <React.Fragment key={protocol}>
              {i !== 0 || protocol_url ? <Divider /> : null}
              <ProtocolLink protocolUrl={protocol.protocol_doi} />
              <SectionItem label="Image Files">
                <StyledTypography variant="body1">{protocol.protocol_file || 'No File Available'}</StyledTypography>
              </SectionItem>
            </React.Fragment>
          ))}
      </StyledPaper>
    </SectionContainer>
  );
}

Protocol.propTypes = {
  protocol_url: PropTypes.string,
  portal_uploaded_protocol_files: PropTypes.arrayOf(PropTypes.object),
};

Protocol.defaultProps = {
  protocol_url: '',
  portal_uploaded_protocol_files: [],
};

export default React.memo(Protocol);

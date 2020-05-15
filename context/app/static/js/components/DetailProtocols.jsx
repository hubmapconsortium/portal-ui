/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionItem from './SectionItem';
import SectionContainer from './SectionContainer';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const StyledLink = styled(Link)`
  color: #3781D1;
`;

const StyledPaper = styled(Paper)`
  padding: 20px 40px 20px 40px;
`;

function ProtocolLink(props) {
  const { protocolUrl: url } = props;
  return (
    <SectionItem label="Protocol URL">
      <StyledTypography variant="body1">
        {url ? (
          <StyledLink href={`https://${url}`} target="_blank" rel="noopener noreferrer">
            {url}
          </StyledLink>
        ) : 'No URL Available'}
      </StyledTypography>
    </SectionItem>
  );
}

function DetailProtocols(props) {
  const { assayMetadata } = props;
  const { protocol_url, portal_uploaded_protocol_files } = assayMetadata;
  return (
    <SectionContainer>
      <SectionHeader variant="h3" component="h2">Protocols</SectionHeader>
      <Divider />
      <StyledPaper>
        <ProtocolLink protocolUrl={protocol_url} />
        {portal_uploaded_protocol_files && portal_uploaded_protocol_files.map((protocol, i) => (
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

export default DetailProtocols;

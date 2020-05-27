/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import NoticeAlert from '../NoticeAlert';
import TableOfContents from './TableOfContents';

const FlexColumn = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-width: 1280px;
`;

const FlexRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;

function DetailLayout(props) {
  const {
    displayViz,
    displayProtocol,
    displayMetadata,
    displayMetadataTable,
    displayFiles,
    displayDag,
    flashed_messages,
    children,
  } = props;

  const updateSections = () => {
    const sections = new Map([
      ['summary', { text: 'Summary', hash: 'summary' }],
      ['metadata', { text: 'Metadata', hash: 'metadata' }],
      ['visualization', { text: 'Visualization', hash: 'visualization' }],
      ['attribution', { text: 'Attribution', hash: 'attribution' }],
      ['provenance', { text: 'Provenance', hash: 'provenance' }],
      ['protocol', { text: 'Protocol', hash: 'protocol' }],
      ['metadataTable', { text: 'Metadata', hash: 'metadata-table' }],
      ['files', { text: 'Files', hash: 'files' }],
      ['dagProv', { text: 'DAG Provenance', hash: 'dag-provenance' }],
    ]);
    if (!displayMetadata) {
      sections.delete('metadata');
    }
    if (!displayViz) {
      sections.delete('visualization');
    }
    if (!displayProtocol) {
      sections.delete('protocol');
    }

    if (!displayMetadataTable) {
      sections.delete('metadataTable');
    }
    if (!displayFiles) {
      sections.delete('files');
    }
    if (!displayDag) {
      sections.delete('dagProv');
    }
    return sections;
  };

  const sections = updateSections();

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <FlexColumn maxWidth="lg">
        {(flashed_messages && flashed_messages.length) && <NoticeAlert errors={flashed_messages} />}
        {children}
      </FlexColumn>
    </FlexRow>
  );
}

export default DetailLayout;

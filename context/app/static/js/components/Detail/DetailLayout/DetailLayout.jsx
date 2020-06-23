import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { capitalizeString } from 'helpers/functions';
import TableOfContents from '../TableOfContents';
import { Content, FlexRow } from './style';

function getSectionFromString(s) {
  if (s === 'metadataTable') {
    return [s, { text: 'Metadata', hash: 'metadata-table' }];
  }
  if (s === 'dagProv') {
    return [s, { text: 'DAG Provenance', hash: 'dag-provenance' }];
  }
  return [s, { text: capitalizeString(s), hash: s }];
}

function getPossibleSections() {
  return [
    'summary',
    'metadata',
    'visualization',
    'attribution',
    'provenance',
    'protocols',
    'metadataTable',
    'files',
    'dagProv',
  ].map((s) => getSectionFromString(s));
}

function testAndDeleteFromObject(toDelete, obj, test) {
  if (test) {
    obj.delete(toDelete);
  }
}

function DetailLayout(props) {
  const { shouldDisplaySection, children } = props;

  const getSections = () => {
    const sections = new Map(getPossibleSections());
    const sectionsToTest = ['metadata', 'visualization', 'protocols', 'metadataTable', 'files', 'dagProv'];
    sectionsToTest.forEach((section) => testAndDeleteFromObject(section, sections, !shouldDisplaySection[section]));
    return sections;
  };

  const sections = getSections();

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <Content>{children}</Content>
    </FlexRow>
  );
}

DetailLayout.propTypes = {
  shouldDisplaySection: PropTypes.objectOf(PropTypes.bool).isRequired,
  children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.bool])).isRequired,
};

export default DetailLayout;

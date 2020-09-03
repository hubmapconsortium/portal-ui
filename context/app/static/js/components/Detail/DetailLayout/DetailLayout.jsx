import React from 'react';
import PropTypes from 'prop-types';

import TableOfContents from '../TableOfContents';
import { Content, FlexRow } from './style';
import { getSections } from './utils';

function DetailLayout(props) {
  const { sectionOrder, children } = props;

  // section hash must match section id in each component
  const sections = new Map(getSections(sectionOrder));

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <Content>{children}</Content>
    </FlexRow>
  );
}

DetailLayout.propTypes = {
  sectionOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.bool])).isRequired,
};

export default DetailLayout;

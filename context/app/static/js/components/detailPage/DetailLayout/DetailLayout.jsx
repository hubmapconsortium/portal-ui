import React from 'react';
import PropTypes from 'prop-types';

import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import SharedAlerts from 'js/components/detailPage/alerts/SharedAlerts';
import { Content, FlexRow, StyledDiv } from './style';

function DetailLayout({ sectionOrder, additionalAlerts, children }) {
  // section hash must match section id in each component
  const sections = new Map(getSections(sectionOrder));

  return (
    <StyledDiv>
      <SharedAlerts additionalAlerts={additionalAlerts} />
      <FlexRow>
        <TableOfContents items={[...sections.values()]} />
        <Content>{children}</Content>
      </FlexRow>
    </StyledDiv>
  );
}

DetailLayout.propTypes = {
  sectionOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.bool])).isRequired,
};

export default DetailLayout;

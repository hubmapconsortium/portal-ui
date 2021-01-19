import React from 'react';
import PropTypes from 'prop-types';

import useEntityStore from 'js/stores/useEntityStore';
import TableOfContents from '../TableOfContents';
import { Content, FlexRow, StyledAlert } from './style';
import { getSections } from './utils';

const entityStoreSelector = (state) => ({
  shouldDisplaySavedListsAlert: state.shouldDisplaySavedListsAlert,
  toggleShouldDisplaySavedListsAlert: state.toggleShouldDisplaySavedListsAlert,
});

function DetailLayout(props) {
  const { sectionOrder, children } = props;

  const { shouldDisplaySavedListsAlert, toggleShouldDisplaySavedListsAlert } = useEntityStore(entityStoreSelector);

  // section hash must match section id in each component
  const sections = new Map(getSections(sectionOrder));

  return (
    <>
      {shouldDisplaySavedListsAlert && (
        <StyledAlert severity="success" onClose={() => toggleShouldDisplaySavedListsAlert()}>
          Successfully added to My Saves List. All data are currently stored on local storage and are not transferable
          between devices.
        </StyledAlert>
      )}
      <FlexRow>
        <TableOfContents items={[...sections.values()]} />
        <Content>{children}</Content>
      </FlexRow>
    </>
  );
}

DetailLayout.propTypes = {
  sectionOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.bool])).isRequired,
};

export default DetailLayout;

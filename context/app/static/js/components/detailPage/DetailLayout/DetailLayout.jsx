import React from 'react';
import PropTypes from 'prop-types';

import useEntityStore, { savedAlertStatus, editedAlertStatus } from 'js/stores/useEntityStore';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import { Content, FlexRow, StyledAlert } from './style';

const entityStoreSelector = (state) => ({
  shouldDisplaySavedOrEditedAlert: state.shouldDisplaySavedOrEditedAlert,
  setShouldDisplaySavedOrEditedAlert: state.setShouldDisplaySavedOrEditedAlert,
});

function DetailLayout(props) {
  const { sectionOrder, children } = props;

  const { shouldDisplaySavedOrEditedAlert, setShouldDisplaySavedOrEditedAlert } = useEntityStore(entityStoreSelector);

  // section hash must match section id in each component
  const sections = new Map(getSections(sectionOrder));

  return (
    <>
      {shouldDisplaySavedOrEditedAlert === savedAlertStatus && (
        <StyledAlert severity="success" onClose={() => setShouldDisplaySavedOrEditedAlert(false)}>
          Successfully added to My Saves List. All lists are currently stored on local storage and are not transferable
          between devices.
        </StyledAlert>
      )}
      {shouldDisplaySavedOrEditedAlert === editedAlertStatus && (
        <StyledAlert severity="success" onClose={() => setShouldDisplaySavedOrEditedAlert(false)}>
          Successfully updated save status. All lists are currently stored on local storage and are not transferable
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

import React from 'react';
import PropTypes from 'prop-types';

import VizualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import SaveEditEntityButton from 'js/components/detailPage/SaveEditEntityButton';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { FileIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FlexContainer, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';
import WorkspaceMenu from '../WorkspaceMenu';

const iconMap = {
  Dataset: <StyledDatasetIcon />,
  Sample: <StyledSampleIcon />,
  Donor: <StyledDonorIcon />,
};
function EntityHeaderContent({ uuid, hubmap_id, entity_type, data, vizIsFullscreen }) {
  return (
    <FlexContainer maxWidth={vizIsFullscreen ? false : 'lg'}>
      {entity_type && (
        <>
          {iconMap[entity_type]}
          <EntityHeaderItem text={hubmap_id} />
          {Object.entries(data).map(([k, v]) => (
            <EntityHeaderItem text={v.value || `undefined ${v.label}`} key={k} />
          ))}
        </>
      )}
      <RightDiv>
        <WorkspaceMenu uuid={uuid} entity_type={entity_type} />
        <SecondaryBackgroundTooltip title="View JSON">
          <WhiteBackgroundIconButton
            href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`}
            target="_blank"
            component="a"
          >
            <FileIcon color="primary" />
          </WhiteBackgroundIconButton>
        </SecondaryBackgroundTooltip>
        {<SaveEditEntityButton uuid={uuid} entity_type={entity_type} />}
        {vizIsFullscreen && (
          <>
            <VisualizationShareButtonWrapper />
            <VizualizationThemeSwitch />
            <VisualizationCollapseButton />
          </>
        )}
      </RightDiv>
    </FlexContainer>
  );
}

EntityHeaderContent.propTypes = {
  hubmap_id: PropTypes.string,
  entity_type: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.object),
  vizIsFullscreen: PropTypes.bool.isRequired,
};

EntityHeaderContent.defaultProps = {
  hubmap_id: undefined,
  entity_type: undefined,
  data: {},
};

export default EntityHeaderContent;

import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';

import VizualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import SaveEditEntityButton from 'js/components/detailPage/SaveEditEntityButton';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { FileIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FlexContainer, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';

const iconMap = {
  Dataset: <StyledDatasetIcon />,
  Sample: <StyledSampleIcon />,
  Donor: <StyledDonorIcon />,
};

const AnimatedFlexContainer = animated(FlexContainer);

function EntityHeaderContent({ uuid, hubmap_id, entity_type, data, shouldDisplayHeader, vizIsFullscreen }) {
  const transitions = useTransition(shouldDisplayHeader, null, {
    from: { opacity: vizIsFullscreen ? 1 : 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <AnimatedFlexContainer style={props} key={key} maxWidth={vizIsFullscreen ? false : 'lg'}>
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
        </AnimatedFlexContainer>
      ),
  );
}

EntityHeaderContent.propTypes = {
  hubmap_id: PropTypes.string,
  entity_type: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.object),
  shouldDisplayHeader: PropTypes.bool.isRequired,
  vizIsFullscreen: PropTypes.bool.isRequired,
};

EntityHeaderContent.defaultProps = {
  hubmap_id: undefined,
  entity_type: undefined,
  data: {},
};

export default EntityHeaderContent;

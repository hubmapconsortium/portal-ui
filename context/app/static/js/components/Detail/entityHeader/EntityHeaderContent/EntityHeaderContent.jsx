import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';

import VizualizationThemeSwitch from 'js/components/Detail/visualization/VisualizationThemeSwitch';
import VisualizationShareButton from 'js/components/Detail/visualization/VisualizationShareButton';
import VisualizationCollapseButton from 'js/components/Detail/visualization/VisualizationCollapseButton';
import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FlexContainer, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';

const iconMap = {
  Dataset: <StyledDatasetIcon />,
  Sample: <StyledSampleIcon />,
  Donor: <StyledDonorIcon />,
};

const AnimatedFlexContainer = animated(FlexContainer);

function EntityHeaderContent({ display_doi, entity_type, data, shouldDisplayHeader, vizIsFullscreen }) {
  const transitions = useTransition(shouldDisplayHeader, null, {
    from: { opacity: vizIsFullscreen ? 1 : 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <AnimatedFlexContainer style={props} key={key} maxWidth={vizIsFullscreen ? false : 'lg'}>
          {iconMap[entity_type]}
          <EntityHeaderItem text={display_doi} />
          {Object.entries(data).map(([k, v]) => (
            <EntityHeaderItem text={v.value || `undefined ${v.label}`} key={k} />
          ))}
          {vizIsFullscreen && (
            <RightDiv>
              <VisualizationShareButton />
              <VizualizationThemeSwitch />
              <VisualizationCollapseButton />
            </RightDiv>
          )}
        </AnimatedFlexContainer>
      ),
  );
}

EntityHeaderContent.propTypes = {
  display_doi: PropTypes.string,
  entity_type: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.object),
  shouldDisplayHeader: PropTypes.bool.isRequired,
  vizIsFullscreen: PropTypes.bool.isRequired,
};

EntityHeaderContent.defaultProps = {
  display_doi: undefined,
  entity_type: undefined,
  data: {},
};

export default EntityHeaderContent;

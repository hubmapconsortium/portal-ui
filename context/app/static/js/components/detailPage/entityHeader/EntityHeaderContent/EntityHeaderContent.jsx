import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';

import VizualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FlexContainer, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';

const iconMap = {
  Dataset: <StyledDatasetIcon />,
  Sample: <StyledSampleIcon />,
  Donor: <StyledDonorIcon />,
};

const AnimatedFlexContainer = animated(FlexContainer);

const entityToFieldsMap = {
  Donor: {
    sex: ({ sex }) => sex,
    race: ({ race }) => race && race.join(', '),
    age: ({ age_value, age_unit }) => age_value && age_unit && `${age_value} ${age_unit}`,
  },
  Sample: {
    'organ type': ({ mapped_organ }) => mapped_organ,
    'sample category': ({ sample_category }) => sample_category,
  },
  Dataset: {
    'organ type': ({ mapped_organ }) => mapped_organ,
    'data type': ({ mapped_data_types }) => mapped_data_types && mapped_data_types.join(', '),
  },
};

function EntityHeaderContent({ assayMetadata, shouldDisplayHeader, vizIsFullscreen }) {
  const transitions = useTransition(shouldDisplayHeader, null, {
    from: { opacity: vizIsFullscreen ? 1 : 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const { hubmap_id, entity_type } = assayMetadata;

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <AnimatedFlexContainer style={props} key={key} maxWidth={vizIsFullscreen ? false : 'lg'}>
          {entity_type && (
            <>
              {iconMap[entity_type]}
              <EntityHeaderItem text={hubmap_id} />
              {Object.entries(entityToFieldsMap[entity_type]).map(([label, fn]) => (
                <EntityHeaderItem text={fn(assayMetadata) || `undefined ${label}`} key={label} />
              ))}
            </>
          )}
          {vizIsFullscreen && (
            <RightDiv>
              <VisualizationShareButtonWrapper />
              <VizualizationThemeSwitch />
              <VisualizationCollapseButton />
            </RightDiv>
          )}
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

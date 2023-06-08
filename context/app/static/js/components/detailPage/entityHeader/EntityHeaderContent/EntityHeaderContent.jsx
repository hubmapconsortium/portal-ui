import React from 'react';
import PropTypes from 'prop-types';
import { animated, useSpring } from 'react-spring';

import VizualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationCollapseButton from 'js/components/detailPage/visualization/VisualizationCollapseButton';
import VisualizationNotebookButton from 'js/components/detailPage/visualization/VisualizationNotebookButton';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { StyledSvgIcon, FlexContainer, RightDiv } from './style';
import EntityHeaderItem from '../EntityHeaderItem';
import VisualizationShareButtonWrapper from '../VisualizationShareButtonWrapper';

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
  Publication: {
    title: ({ title }) => title,
    'publication venue': ({ publication_venue }) => publication_venue,
  },
};

const AnimatedFlexContainer = animated(FlexContainer);

const vizNotebookIdSelector = (state) => state.vizNotebookId;

function EntityHeaderContent({ assayMetadata, shouldDisplayHeader, vizIsFullscreen }) {
  const { hubmap_id, entity_type } = assayMetadata;

  const vizNotebookId = useVisualizationStore(vizNotebookIdSelector);

  const styles = useSpring({
    opacity: shouldDisplayHeader || vizIsFullscreen ? 1 : 0,
  });

  return (
    <AnimatedFlexContainer style={styles} maxWidth={vizIsFullscreen ? false : 'lg'}>
      {entity_type && (
        <>
          <StyledSvgIcon component={entityIconMap[entity_type]} />
          <EntityHeaderItem text={hubmap_id} />
          {entity_type in entityToFieldsMap
            ? Object.entries(entityToFieldsMap[entity_type]).map(([label, fn]) => (
                <EntityHeaderItem text={fn(assayMetadata) || `undefined ${label}`} key={label} />
              ))
            : null}
        </>
      )}
      {vizIsFullscreen && (
        <RightDiv>
          {vizNotebookId && <VisualizationNotebookButton uuid={vizNotebookId} />}
          <VisualizationShareButtonWrapper />
          <VizualizationThemeSwitch />
          <VisualizationCollapseButton />
        </RightDiv>
      )}
    </AnimatedFlexContainer>
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

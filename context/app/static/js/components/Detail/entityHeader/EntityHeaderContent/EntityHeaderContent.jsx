import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';

import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FlexContainer } from './style';
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
        <AnimatedFlexContainer style={props} key={key}>
          {iconMap[entity_type]}
          <EntityHeaderItem text={display_doi} />
          {Object.entries(data).map(([k, v]) => (
            <EntityHeaderItem text={v.value ? v.value : `undefined ${v.label}`} key={k} />
          ))}
        </AnimatedFlexContainer>
      ),
  );
}

EntityHeaderContent.propTypes = {
  display_doi: PropTypes.string,
  entity_type: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.string),
  summaryInView: PropTypes.bool,
};

EntityHeaderContent.defaultProps = {
  display_doi: undefined,
  entity_type: undefined,
  data: [],
  summaryInView: false,
};

export default EntityHeaderContent;

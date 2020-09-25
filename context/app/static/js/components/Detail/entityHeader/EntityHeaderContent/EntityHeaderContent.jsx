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

function EntityHeaderContent({ display_doi, entity_type, data, summaryInView }) {
  const transitions = useTransition(!summaryInView, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <AnimatedFlexContainer style={props} key={key}>
          {iconMap[entity_type]}
          <EntityHeaderItem text={display_doi} />
          {data.map((d) => d && <EntityHeaderItem text={d} key={d} />)}
        </AnimatedFlexContainer>
      ),
  );
}

EntityHeaderContent.propTypes = {
  display_doi: PropTypes.string,
  entity_type: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.string),
  summaryInView: PropTypes.bool,
};

EntityHeaderContent.defaultProps = {
  display_doi: undefined,
  entity_type: undefined,
  data: [],
  summaryInView: false,
};

export default EntityHeaderContent;

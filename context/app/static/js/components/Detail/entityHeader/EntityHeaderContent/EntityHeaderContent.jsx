import React from 'react';
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
  const transitions = useTransition(!summaryInView && [true], null, {
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
          {Object.entries(data).map(([k, v]) => v && <EntityHeaderItem text={v} key={k} />)}
        </AnimatedFlexContainer>
      ),
  );
}

export default EntityHeaderContent;

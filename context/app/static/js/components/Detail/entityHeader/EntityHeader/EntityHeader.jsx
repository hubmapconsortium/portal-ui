import React from 'react';
import { useTransition, animated } from 'react-spring';

import useStore from 'js/components/store';
import { StyledPaper, FlexContainer } from './style';
import EntityHeaderContent from '../EntityHeaderContent';

const AnimatedPaper = animated(StyledPaper);

function Header() {
  const transitions = useTransition([true], null, {
    from: { overflow: 'hidden', height: 0 },
    enter: { height: 35 },
    leave: { height: 0 },
  });
  const assayMetadata = useStore((state) => state.assayMetadata);
  const { display_doi, entity_type } = assayMetadata;

  const data = (({ mapped_organ, mapped_data_types, mapped_specimen_type, sex, race }) => ({
    mapped_organ,
    mapped_data_types,
    mapped_specimen_type,
    sex,
    race,
  }))(assayMetadata);

  if ('age_value' in assayMetadata && 'age_unit' in assayMetadata) {
    data.age = `${assayMetadata.age_value} ${assayMetadata.age_unit}`;
  }

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <AnimatedPaper key={key} style={props} elevation={4}>
          <FlexContainer maxWidth="lg">
            <EntityHeaderContent display_doi={display_doi} entity_type={entity_type} data={data} />
          </FlexContainer>
        </AnimatedPaper>
      ),
  );
}

export default Header;

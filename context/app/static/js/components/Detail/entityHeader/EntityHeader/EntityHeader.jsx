import React from 'react';
import { useTransition, animated } from 'react-spring';

import useStore from 'js/components/store';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';

const AnimatedPaper = animated(StyledPaper);

function Header() {
  const summaryInView = useStore((state) => state.summaryInView);
  const transitions = useTransition(!summaryInView && [true], null, {
    from: { overflow: 'hidden', height: 0 },
    enter: { height: 35 },
    leave: { overflow: 'hidden', height: 0 },
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
          <EntityHeaderContent
            display_doi={display_doi}
            entity_type={entity_type}
            data={data}
            summaryInView={summaryInView}
          />
        </AnimatedPaper>
      ),
  );
}

export default Header;

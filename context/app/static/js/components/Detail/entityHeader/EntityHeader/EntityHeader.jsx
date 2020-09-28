import React from 'react';
import { useTransition, animated } from 'react-spring';

import useEntityStore from 'js/stores/useEntityStore';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';
import { extractHeaderMetadata } from './utils';

const AnimatedPaper = animated(StyledPaper);
const entitySelector = (state) => ({
  assayMetadata: state.assayMetadata,
  summaryInView: state.summaryInView,
});

const entityHeaderHeight = 35;

function Header() {
  const { assayMetadata, summaryInView } = useEntityStore(entitySelector);
  const transitions = useTransition(!summaryInView, null, {
    from: { overflow: 'hidden', height: 0 },
    enter: { height: entityHeaderHeight },
    leave: { overflow: 'hidden', height: 0 },
  });
  const { display_doi, entity_type } = assayMetadata;

  const data = extractHeaderMetadata(assayMetadata, entity_type);
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
export { entityHeaderHeight };
export default Header;

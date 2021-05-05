import React from 'react';

import { FlexDiv, FacetLabel, FacetValue } from './style';

function FacetSearchMenuListItem({ entityType, matches, labels }) {
  return (
    <li>
      {Object.entries(matches).map(([k, v]) => {
        return (
          <FlexDiv key={k}>
            <FacetLabel color="primary" variant="subtitle2">{`${labels[k]} (${entityType}s)`}</FacetLabel>
            {v.map((m) => (
              <FacetValue
                key={m.key}
                variant="body2"
                component="a"
                href={`/search?entity_type[0]=${entityType}&${encodeURIComponent(k)}[0]=${encodeURIComponent(m.key)}`}
              >
                {m.key}
              </FacetValue>
            ))}
          </FlexDiv>
        );
      })}
    </li>
  );
}

export default FacetSearchMenuListItem;

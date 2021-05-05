import React from 'react';

import { FlexDiv, FacetLabel, FacetValue } from './style';

function FacetSearchEntityListItems({ entityType, matches, labels }) {
  return (
    <li>
      {Object.entries(matches).map(([k, v]) => {
        return (
          <FlexDiv key={k}>
            <FacetLabel color="primary" variant="subtitle2">{`${labels[k]} (${entityType}s)`}</FacetLabel>
            {v.map((m) => {
              const facetQueryParam =
                k === 'mapped_data_access_level'
                  ? `mapped_status-mapped_data_access_level[0][0]=Published&mapped_status-mapped_data_access_level[1][0]=${encodeURIComponent(
                      m.key,
                    )}`
                  : `${encodeURIComponent(k)}[0]=${encodeURIComponent(m.key)}`;
              return (
                <FacetValue
                  key={m.key}
                  variant="body2"
                  component="a"
                  href={`/search?entity_type[0]=${entityType}&${facetQueryParam}`}
                >
                  {m.key}
                </FacetValue>
              );
            })}
          </FlexDiv>
        );
      })}
    </li>
  );
}

export default FacetSearchEntityListItems;

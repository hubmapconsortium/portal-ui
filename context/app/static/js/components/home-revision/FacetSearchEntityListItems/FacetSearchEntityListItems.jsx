import React from 'react';

import { StyledList, FacetLabel, FacetValue } from './style';

function FacetSearchEntityListItems({ entityType, matches, labels }) {
  return (
    <li>
      {Object.entries(matches).map(([k, v]) => {
        return (
          <React.Fragment key={k}>
            <FacetLabel color="primary" variant="subtitle2">{`${labels[k]} (${entityType}s)`}</FacetLabel>
            <StyledList>
              {v.map((m) => {
                const facetQueryParam =
                  k === 'mapped_data_access_level'
                    ? `mapped_status-mapped_data_access_level[0][0]=Published&mapped_status-mapped_data_access_level[1][0]=${encodeURIComponent(
                        m.key,
                      )}`
                    : `${encodeURIComponent(k)}[0]=${encodeURIComponent(m.key)}`;
                return (
                  <li key={m.key}>
                    <FacetValue
                      variant="body2"
                      component="a"
                      href={`/search?entity_type[0]=${entityType}&${facetQueryParam}`}
                    >
                      {m.key}
                    </FacetValue>
                  </li>
                );
              })}
            </StyledList>
          </React.Fragment>
        );
      })}
    </li>
  );
}

export default FacetSearchEntityListItems;

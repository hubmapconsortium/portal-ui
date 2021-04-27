import React from 'react';

import { FlexDiv, FacetLabel, FacetValue } from './style';

function EntityMenuList({ entityType, matches }) {
  return (
    <li>
      {Object.entries(matches).map(([k, v]) => {
        return (
          <FlexDiv key={k}>
            <FacetLabel color="primary" variant="subtitle2">{`${k} (${entityType}s)`}</FacetLabel>
            {v.map((m) => (
              <FacetValue
                key={m.key}
                variant="body2"
                component="a"
                href={encodeURI(`/search?entity_type[0]=${entityType}&${k}[0]=${m.key}`)}
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

export default EntityMenuList;

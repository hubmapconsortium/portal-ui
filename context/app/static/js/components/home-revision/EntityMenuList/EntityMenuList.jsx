import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

function EntityMenuList({ entityType, matches }) {
  return (
    <li>
      {Object.entries(matches).map(([k, v]) => {
        return (
          <div key={v}>
            <Typography>{`${k} (${entityType}s)`}</Typography>
            {v.map((m) => (
              <MenuItem key={m.key}>{m.key}</MenuItem>
            ))}
          </div>
        );
      })}
    </li>
  );
}

export default EntityMenuList;

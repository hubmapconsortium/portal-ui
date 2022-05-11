import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';

import { AppContext } from 'js/components/Providers';

function Services() {
  const endpoints = useContext(AppContext);
  return (
    <Paper>
      {
        // eslint-disable-next-line no-undef
        `TODO: Use token "${workspaces_token}" with "${endpoints.workspacesEndpoint}"`
      }
    </Paper>
  );
}

export default Services;

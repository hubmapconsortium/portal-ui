import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';

import { SeparatedFlexRow, FlexBottom } from './style';

function Services() {
  const endpoints = useContext(AppContext);
  return (
    <>
      <SeparatedFlexRow>
        <div>
          <Typography variant="subtitle1">## Workspaces</Typography>
        </div>
        <FlexBottom>TODO</FlexBottom>
      </SeparatedFlexRow>
      <Paper>
        {
          // eslint-disable-next-line no-undef
          `TODO: Use token "${workspaces_token}" with "${endpoints.workspacesEndpoint}"`
        }
      </Paper>
    </>
  );
}

export default Services;

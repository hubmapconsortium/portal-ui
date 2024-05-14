import React from 'react';

import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface EntityListProps<T extends { uuid: string }> {
  entityName: string;
  entities: T[];
  entityComponent: React.FC<{ entity: T }>;
  viewAllLink: string;
}

export function EntityList<T extends { uuid: string }>({
  entityName,
  entities,
  entityComponent: EntityComponent,
  viewAllLink,
}: EntityListProps<T>) {
  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h4" mb={1}>
        Recent {entityName}
      </Typography>
      <Paper>
        {entities.map((entity) => (
          <EntityComponent key={entity.uuid} entity={entity} />
        ))}
        <Box p={2} display="flex" justifyContent="center">
          <Button component={Link} variant="outlined" href={viewAllLink}>
            View All {entityName}
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
}

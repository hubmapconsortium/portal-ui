import React from 'react';

import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import Stack from '@mui/material/Stack';

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
  const pluralEntityName = `${entityName}s`;
  const Icon = entityIconMap[entityName as keyof typeof entityIconMap];
  return (
    <Grid item xs={12} md={6}>
      <Stack spacing={1} direction="row" alignItems="center" mb={1}>
        <Icon sx={{ width: '2rem', height: '2rem' }} color="primary" />
        <Typography variant="h4" mb={1}>
          Recent {pluralEntityName}
        </Typography>
      </Stack>
      <Paper>
        {entities.map((entity) => (
          <EntityComponent key={entity.uuid} entity={entity} />
        ))}
        <Box p={2} display="flex" justifyContent="center">
          <Button
            component={Link}
            variant="outlined"
            sx={(theme) => ({
              border: `1px solid ${theme.palette.primary.lowEmphasis}`,
              borderRadius: '0.25rem',
            })}
            href={viewAllLink}
            startIcon={<Icon />}
          >
            View All {pluralEntityName}
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
}

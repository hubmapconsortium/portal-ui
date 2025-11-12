import React from 'react';
import Grid from '@mui/material/Grid2';
import {
  useTutorialsByCategory,
  useFeaturedTutorials,
  useTutorialLandingPageTutorials,
  useTutorialLandingPageSearch,
  useTutorialLandingPageFilterCategories,
} from './TutorialLandingPageContext';
import { Tutorial, TutorialCategory, TUTORIAL_CATEGORY_DATA, TutorialCategoryData, TUTORIAL_CATEGORIES } from './types';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import SelectableCard from 'js/shared-styles/cards/SelectableCard';
import Typography from '@mui/material/Typography';
import { InternalLink } from 'js/shared-styles/Links';
import Button from '@mui/material/Button';
import { tutorialIsReady } from './utils';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

interface TutorialDisplayProps {
  tutorial: Tutorial;
}

function TutorialButton({ tutorial }: TutorialDisplayProps) {
  if (!tutorialIsReady(tutorial)) {
    return (
      <Button disabled fullWidth variant="contained" color="primary">
        Coming Soon
      </Button>
    );
  } else {
    return (
      <Button
        component={InternalLink}
        href={`/tutorials/${tutorial.route}`}
        fullWidth
        variant="contained"
        color="primary"
      >
        View Tutorial
      </Button>
    );
  }
}

export function TutorialCard({ tutorial }: TutorialDisplayProps) {
  return (
    <Grid
      key={tutorial.route}
      size={{
        xs: 12,
        sm: 6,
      }}
      justifyContent="stretch"
    >
      <SelectableCard
        title={tutorial.title}
        description={tutorial.description}
        route={tutorial.route}
        cardKey={tutorial.title}
        tags={tutorial.tags}
        category={tutorial.category}
        data-testid="tutorial-card"
        grow
      >
        <Box mt={1}>
          <TutorialButton tutorial={tutorial} />
        </Box>
      </SelectableCard>
    </Grid>
  );
}

interface TutorialContainerProps extends TutorialCategoryData {
  tutorials: Tutorial[];
}

function TutorialCategoryDisplay({ tutorials, title, description, id, icon: Icon }: TutorialContainerProps) {
  if (tutorials.length === 0) {
    return null;
  }

  return (
    <Grid container>
      <Stack
        component="header"
        direction="row"
        alignItems="center"
        sx={{
          scrollPaddingTop: headerHeight + 10,
        }}
        spacing={1}
        id={id}
      >
        {Icon && <Icon color="primary" fontSize="1.5rem" />}
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
      <Grid size={12}>
        <p>{description}</p>
      </Grid>

      <Grid container spacing={2} size={12} width="100%">
        {[...tutorials]
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((tutorial) => (
            <TutorialCard key={tutorial.route} tutorial={tutorial} />
          ))}
      </Grid>
    </Grid>
  );
}

interface TutorialCategoryDisplayProps {
  category: TutorialCategory;
}

function FeaturedTutorialsContainer() {
  const featuredTutorials = useFeaturedTutorials();

  if (featuredTutorials.length === 0) {
    return null;
  }

  return (
    <Box component={Paper} p={2}>
      <TutorialCategoryDisplay {...TUTORIAL_CATEGORY_DATA['Featured Tutorials']} tutorials={featuredTutorials} />
    </Box>
  );
}

function TutorialCategoryContainer({ category }: TutorialCategoryDisplayProps) {
  const tutorials = useTutorialsByCategory(category);
  return <TutorialCategoryDisplay {...TUTORIAL_CATEGORY_DATA[category]} tutorials={tutorials} />;
}

function NoTutorialsMessage() {
  const search = useTutorialLandingPageSearch();
  const filterCategories = useTutorialLandingPageFilterCategories();

  const hasActiveFilters = search.length > 0 || filterCategories.length > 0;

  if (!hasActiveFilters) {
    return (
      <Box component={Paper} p={3} textAlign="center">
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Tutorials Available
        </Typography>
        <Typography variant="body1" color="text.secondary">
          There are currently no tutorials available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component={Paper} p={3} textAlign="center">
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Tutorials Found
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        No tutorials match your current search and filter criteria.
      </Typography>
      <Stack spacing={1} alignItems="center">
        {search.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Search: <strong>&ldquo;{search}&rdquo;</strong>
          </Typography>
        )}
        {filterCategories.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Categories: <strong>{filterCategories.join(', ')}</strong>
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search terms or removing some filters.
        </Typography>
      </Stack>
    </Box>
  );
}

export default function TutorialsList() {
  const tutorials = useTutorialLandingPageTutorials();

  // If no tutorials to show, show helpful message
  if (tutorials.length === 0) {
    return <NoTutorialsMessage />;
  }

  return (
    <>
      <Stack spacing={2}>
        <FeaturedTutorialsContainer />
        <Stack component={Paper} p={2} gap={2} useFlexGap>
          {[...TUTORIAL_CATEGORIES]
            .sort((a, b) => a.localeCompare(b))
            .map((category) => (
              <TutorialCategoryContainer key={category} category={category} />
            ))}
        </Stack>
      </Stack>
    </>
  );
}

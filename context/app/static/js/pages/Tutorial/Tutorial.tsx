import React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { TUTORIALS } from 'js/components/Tutorials';
import Description from 'js/shared-styles/sections/Description';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { TutorialCategory } from 'js/components/Tutorials/types';
import { TutorialCard } from 'js/components/Tutorials/TutorialList';
import Grid from '@mui/material/Grid2';
import MenuBookRounded from '@mui/icons-material/MenuBookRounded';

interface TutorialProps {
  tutorialRoute: string;
}

const useCurrentTutorial = (tutorialRoute: string) => {
  const tutorial = TUTORIALS.find((t) => t.route === tutorialRoute);
  if (!tutorial) {
    throw new Error(`Tutorial with name ${tutorialRoute} not found`);
  }
  return tutorial;
};

const useRelatedTutorials = (route: string, category: TutorialCategory) => {
  const relatedTutorials = TUTORIALS.filter((t) => t.route !== route && t.category === category);
  return relatedTutorials;
};

const StyledIframe = styled('iframe')({
  border: 'none',
  width: '100%',
  aspectRatio: '3 / 1.75',
});

function TutorialDetailPage({ tutorialRoute }: TutorialProps) {
  const currentTutorial = useCurrentTutorial(tutorialRoute);
  const { title, description, iframeLink, tags, category } = currentTutorial;

  const relatedTutorials = useRelatedTutorials(tutorialRoute, category);

  return (
    <Stack spacing={2}>
      <PageTitle data-testid="tutorial-title" display="flex" flexDirection="row" alignItems="center" gap={1}>
        <MenuBookRounded fontSize="large" color="primary" />
        {title}
      </PageTitle>
      <Description
        belowTheFold={
          <Stack mt={2} gap={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Tags
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {tags.map((tag) => (
                <Chip key={tag} label={tag} variant="outlined" borderRadius="halfRound" />
              ))}
            </Stack>
          </Stack>
        }
      >
        {description}
      </Description>
      <CollapsibleDetailPageSection title="Tutorial" icon={MenuBookRounded}>
        <StyledIframe src={iframeLink} title={title} />
      </CollapsibleDetailPageSection>
      {relatedTutorials.length > 0 && (
        <CollapsibleDetailPageSection title="Related Tutorials" icon={MenuBookRounded}>
          <Description>
            Explore other tutorials to continue learning about HuBMAP data and the features of the portal.
          </Description>
          <Grid mt={2} spacing={2} container alignContent="stretch">
            {relatedTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.route} tutorial={tutorial} />
            ))}
          </Grid>
        </CollapsibleDetailPageSection>
      )}
    </Stack>
  );
}

export default TutorialDetailPage;

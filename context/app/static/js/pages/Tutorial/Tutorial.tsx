import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { TUTORIALS } from 'js/components/Tutorials';
import Description from 'js/shared-styles/sections/Description';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { TutorialCategory, TUTORIAL_CATEGORY_DATA, TUTORIAL_CATEGORIES, Tutorial } from 'js/components/Tutorials/types';
import { TutorialCard } from 'js/components/Tutorials/TutorialList';
import Grid from '@mui/material/Grid2';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { TableOfContentsItems, TableOfContentsItem } from 'js/shared-styles/sections/TableOfContents/types';
import { tutorialIsReady } from 'js/components/Tutorials/utils';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import { TutorialIcon } from 'js/shared-styles/icons';

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

const useTutorialDirectoryTableOfContents = (currentRoute: string): TableOfContentsItems => {
  return React.useMemo(() => {
    const items: TableOfContentsItems = [];

    // Group tutorials by category, only including those with iframeLink
    const tutorialsByCategory = TUTORIALS.filter(tutorialIsReady).reduce(
      (acc, tutorial) => {
        if (!acc[tutorial.category]) {
          acc[tutorial.category] = [];
        }
        acc[tutorial.category].push(tutorial);
        return acc;
      },
      {} as Record<TutorialCategory, Tutorial[]>,
    );

    // Create table of contents structure
    TUTORIAL_CATEGORIES.forEach((category) => {
      const categoryData = TUTORIAL_CATEGORY_DATA[category];
      const categoryTutorials = tutorialsByCategory[category] || [];

      if (categoryTutorials.length > 0) {
        const categoryItem: TableOfContentsItem = {
          text: categoryData.title,
          hash: categoryData.id,
          icon: categoryData.icon,
          initiallyClosed: categoryTutorials.every((tutorial) => tutorial.route !== currentRoute),
          items: categoryTutorials
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((tutorial) => {
              const isCurrentTutorial = tutorial.route === currentRoute;
              return {
                text: tutorial.title,
                hash: isCurrentTutorial ? `current-tutorial-${tutorial.route}` : `/tutorials/${tutorial.route}`,
                isRoute: !isCurrentTutorial,
              };
            }),
        };

        items.push(categoryItem);
      }
    });

    return items;
  }, [currentRoute]);
};

const StyledIframe = styled('iframe')({
  border: 'none',
  width: '100%',
  aspectRatio: '3 / 1.75',
});

function TutorialDetailPage({ tutorialRoute }: TutorialProps) {
  const currentTutorial = useCurrentTutorial(tutorialRoute);
  const { title, description, iframeLink, tags, category } = currentTutorial;

  useEffect(() => {
    document.title = `${title} | HuBMAP Tutorial`;
  }, [title]);

  const relatedTutorials = useRelatedTutorials(tutorialRoute, category);
  const tutorialDirectoryItems = useTutorialDirectoryTableOfContents(tutorialRoute);

  // Find the current tutorial hash for highlighting
  const currentTutorialHash = `current-tutorial-${tutorialRoute}`;

  return (
    <DetailLayout
      customTableOfContents={tutorialDirectoryItems}
      customCurrentSection={currentTutorialHash}
      tableOfContentsTitle="Other Tutorials"
    >
      <Stack spacing={2}>
        <SummaryTitle entityIcon="Tutorial">Tutorials</SummaryTitle>
        <PageTitle data-testid="tutorial-title" display="flex" flexDirection="row" alignItems="center" gap={1}>
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
                  <Chip key={tag} label={tag} variant="outlined" $borderRadius="halfRound" />
                ))}
              </Stack>
            </Stack>
          }
        >
          {description}
        </Description>
        <CollapsibleDetailPageSection title="Tutorial" icon={TutorialIcon}>
          <StyledIframe src={iframeLink} title={title} />
        </CollapsibleDetailPageSection>
        {relatedTutorials.length > 0 && (
          <CollapsibleDetailPageSection title="Related Tutorials" icon={TutorialIcon}>
            <Description>
              Explore other tutorials to continue learning about HuBMAP data and the features of the portal.
            </Description>
            <Grid mt={2} spacing={2} container justifyContent="stretch">
              {relatedTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.route} tutorial={tutorial} />
              ))}
            </Grid>
          </CollapsibleDetailPageSection>
        )}
      </Stack>
    </DetailLayout>
  );
}

export default TutorialDetailPage;

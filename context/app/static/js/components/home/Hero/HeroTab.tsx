import React, { ComponentType, ReactElement } from 'react';
import { useEventCallback } from '@mui/material/utils';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';
import { trackEvent } from 'js/helpers/trackers';
import { InternalLink } from 'js/shared-styles/Links';
import { HeroTabContainer } from './styles';
import { useHeroTabContext } from './HeroTabsContext';

interface HeroTabActionProps {
  title: string;
  icon: ReactElement;
  tabTitle: string;
  onClick?: () => void;
  href?: string;
}

function HeroTabAction({ title, icon, tabTitle, onClick, href }: HeroTabActionProps) {
  const handleClick = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: `Hero / ${tabTitle}`,
      label: `${title} Button`,
    });

    onClick?.();
  });

  const chip = (
    <Chip borderRadius="halfRound" sx={{ px: 1 }} variant="elevated" icon={icon} label={title} onClick={handleClick} />
  );

  if (href) {
    return (
      <InternalLink sx={{ maxWidth: 'fit-content' }} href={href}>
        {chip}
      </InternalLink>
    );
  }
  return chip;
}
export interface HeroTabProps {
  title: string;
  description: string;
  icon: ReactElement;
  isCurrent?: boolean;
  bgColor?: string;
  actions?: Omit<HeroTabActionProps, 'tabTitle'>[];
  index: number;
  content: ComponentType<Pick<HeroTabProps, 'title' | 'index'>>;
}

export default function HeroTab({ content: Content, ...props }: HeroTabProps) {
  const { title, description, icon, actions, bgColor, index } = props;
  const { activeTab, setActiveTab } = useHeroTabContext();
  const handleInteraction = () => {
    setActiveTab(index);
  };

  return (
    <>
      <Hidden mdDown>
        <Content {...props} />
      </Hidden>
      <HeroTabContainer
        $index={index}
        $activeSlide={activeTab}
        onClick={handleInteraction}
        onMouseEnter={handleInteraction}
        onFocus={handleInteraction}
        onTouchEnd={handleInteraction}
        bgcolor={bgColor}
        tabIndex={0}
        role="tab"
        aria-selected={activeTab === index}
        aria-controls={`tabpanel-${index}`}
        id={`tab-${index}`}
      >
        <Hidden mdUp>
          <Content {...props} />
        </Hidden>
        <Stack p={2} spacing={1}>
          <Stack direction="row" spacing={1}>
            {icon}
            <Typography variant="h5">{title}</Typography>
          </Stack>
          <Typography variant="body1">{description}</Typography>
          {actions?.map((action) => <HeroTabAction key={action.title} tabTitle={title} {...action} />)}
        </Stack>
      </HeroTabContainer>
    </>
  );
}

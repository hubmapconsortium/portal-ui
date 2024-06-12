import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InternalLink } from 'js/shared-styles/Links';
import React, { ComponentType, ReactElement } from 'react';
import Hidden from '@mui/material/Hidden';
import { HeroTabContainer } from './styles';
import { useHeroTabContext } from './HeroTabsContext';

interface HeroTabActionProps {
  title: string;
  icon: ReactElement;
  onClick?: () => void;
  href?: string;
}

function HeroTabAction({ title, icon, onClick, href }: HeroTabActionProps) {
  const chip = (
    <Chip borderRadius="halfRound" sx={{ px: 1 }} variant="elevated" icon={icon} label={title} onClick={onClick} />
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
  actions?: HeroTabActionProps[];
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
        bgcolor={bgColor}
        tabIndex={0}
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
          {actions?.map((action) => <HeroTabAction key={action.title} {...action} />)}
        </Stack>
      </HeroTabContainer>
    </>
  );
}

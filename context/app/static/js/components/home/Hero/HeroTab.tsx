import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InternalLink } from 'js/shared-styles/Links';
import React, { ReactElement } from 'react';
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
    return <InternalLink href={href}>{chip}</InternalLink>;
  }
  return chip;
}

interface HeroTabProps {
  title: string;
  description: string;
  icon: ReactElement;
  isCurrent?: boolean;
  activeBgColor?: string;
  actions?: HeroTabActionProps[];
  index: number;
}

export default function HeroTab({
  title,
  description,
  icon,
  isCurrent,
  actions,
  activeBgColor = '#F0F3EB',
  index
}: HeroTabProps) {
  const { activeTab, setActiveTab } = useHeroTabContext();
  const handleInteraction = () => {
    setActiveTab(index);
  }

  const bgColor = isCurrent ? activeBgColor : '#FFFFFF';

  return (
    <HeroTabContainer $index={index} onClick={handleInteraction} onMouseEnter={handleInteraction} bgcolor={bgColor} >
      <Stack p={2} spacing={1}>
        <Stack direction="row" spacing={1}>
          {icon}
          <Typography variant="h5">{title}</Typography>
        </Stack>
        <Typography variant="body1">{description}</Typography>
        {actions?.map((action) => <HeroTabAction key={action.title} {...action} />)}
      </Stack>
    </HeroTabContainer>
  );
}

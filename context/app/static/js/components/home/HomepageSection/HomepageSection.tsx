import React, { PropsWithChildren, Ref } from 'react';
import Box from '@mui/material/Box';

import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';
import { SectionHeader, OffsetDatasetsHeader } from 'js/pages/Home/style';

interface HomepageSectionProps extends PropsWithChildren {
  title: string;
  icon: MUIIcon;
  gridArea: string;
  useOffset?: boolean;
  id?: string;
  headerRef?: Ref<HTMLElement>;
  actionButtons?: React.ReactNode;
}

function HomepageSection({
  title,
  icon,
  gridArea,
  useOffset = false,
  id,
  headerRef,
  actionButtons,
  children,
}: HomepageSectionProps) {
  const Header = useOffset ? OffsetDatasetsHeader : SectionHeader;

  return (
    <Box gridArea={gridArea}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Header variant="h2" component="h3" icon={icon} id={id} ref={headerRef}>
          {title}
        </Header>
        {actionButtons}
      </Box>
      {children}
    </Box>
  );
}

export default HomepageSection;

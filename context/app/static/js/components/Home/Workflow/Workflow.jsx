import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DescriptionIcon from '@material-ui/icons/DescriptionRounded';
import SearchIcon from '@material-ui/icons/SearchRounded';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDownRounded';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { LightBlueLink } from 'js/shared-styles/Links';
import { CenterIcon } from 'js/shared-styles/icons';
import WorkflowItem from '../WorkflowItem';
import { Flex } from './style';

function ArrowIcon() {
  const theme = useTheme();
  const isRow = useMediaQuery(theme.breakpoints.up('sm'));
  const size = '64px';
  return isRow ? (
    <KeyboardArrowRightIcon style={{ fontSize: size }} />
  ) : (
    <KeyboardArrowDownIcon style={{ fontSize: size }} />
  );
}

function Workflow() {
  return (
    <Flex>
      <WorkflowItem
        text="The HuBMAP Tissue Mapping Centers generate and submit data."
        link={
          <OutboundLink variant="body1" href="https://ingest.hubmapconsortium.org/">
            Help contribute data
          </OutboundLink>
        }
        icon={CenterIcon}
      />
      <ArrowIcon />
      <WorkflowItem text="The HuBMAP Portal Team curates, processes, and releases the data." icon={DescriptionIcon} />
      <ArrowIcon />
      <WorkflowItem
        text="Anyone can discover, visualize, and download data."
        link={
          <LightBlueLink variant="body1" href="/search?entity_type[0]=Dataset">
            Start Searching
          </LightBlueLink>
        }
        icon={SearchIcon}
      />
    </Flex>
  );
}

export default React.memo(Workflow);

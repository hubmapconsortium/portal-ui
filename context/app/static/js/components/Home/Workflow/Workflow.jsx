import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DescriptionIcon from '@material-ui/icons/Description';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { CenterIcon } from 'shared-styles/icons';
import WorkflowItem from '../WorkflowItem';
import { Flex, StyledLink } from './style';

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
          <StyledLink
            variant="body1"
            href="https://ingest.hubmapconsortium.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Help contribute data
          </StyledLink>
        }
        icon={CenterIcon}
      />
      <ArrowIcon />
      <WorkflowItem text="The HuBMAP Portal Team curates, processes, and releases the data." icon={DescriptionIcon} />
      <ArrowIcon />
      <WorkflowItem
        text="Anyone can discover, visualize, and download data."
        link={
          <StyledLink variant="body1" href="/search?entity_type[0]=Dataset">
            Start Searching
          </StyledLink>
        }
        icon={SearchIcon}
      />
    </Flex>
  );
}

export default React.memo(Workflow);

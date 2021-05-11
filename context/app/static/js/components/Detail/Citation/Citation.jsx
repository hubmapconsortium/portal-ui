import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { FlexPaper, Flex, FlexRight } from './style';

function buildNLMCitation({ contributors, title, timestamp }) {
  const joinedContributors = contributors
    .map(({ last_name, first_name }) => `${last_name} ${first_name[0]}`)
    .join(', ');
  const year = new Date(timestamp).getFullYear();
  return `${joinedContributors}. ${title} [Internet]. HuBMAP Consortium; ${year}.`;
}

function Citation({ contributors, title, timestamp, url }) {
  const citation = buildNLMCitation({ contributors, title, timestamp });

  return (
    <SectionContainer id="citation">
      <Flex>
        <SectionHeader>Citation</SectionHeader>
        <FlexRight>
          <Button color="primary" variant="contained">
            View DataCite Page
          </Button>
        </FlexRight>
      </Flex>
      <FlexPaper>
        <Typography variant="body1">
          {citation} Available from: <LightBlueLink href={url}>{url}</LightBlueLink>
        </Typography>
      </FlexPaper>
    </SectionContainer>
  );
}

Citation.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  contributors: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
};

export default Citation;
export { buildNLMCitation };

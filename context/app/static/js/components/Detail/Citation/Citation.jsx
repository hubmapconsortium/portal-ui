import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { FlexPaper } from './style';

function buildNLMCitation({ contributors, title, timestamp }) {
  const firstContributors = contributors
    .slice(0, 6)
    .map(({ last_name, first_name }) => `${last_name} ${first_name[0]}`);
  if (firstContributors.length < contributors.length) {
    firstContributors.push('et al');
  }
  const year = new Date(timestamp).getFullYear();
  return `${firstContributors.join(', ')}. ${title} [Internet]. HuBMAP Consortium; ${year}.`;
}

function Citation({ contributors, title, timestamp, url }) {
  const citation = buildNLMCitation({ contributors, title, timestamp });

  return (
    <SectionContainer id="citation">
      <SectionHeader>Citation</SectionHeader>
      <FlexPaper>
        {citation} Available from: <LightBlueLink href={url}>{url}</LightBlueLink>
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

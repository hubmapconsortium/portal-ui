import React from 'react';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import SectionPaper from '../../shared-styles/sections/SectionPaper/SectionPaper';

function Publication(props) {
  const { titles } = props;

  return (
    <>
      <SectionContainer id="summary">
        <Typography variant="subtitle1">Publications?</Typography>
        <SectionHeader variant="h1" component="h1">
          Publications!
        </SectionHeader>
        <SectionPaper>
          <ul>
            {Object.entries(titles).map(([path, title]) => (
              <li key={path}>
                <LightBlueLink href={`publication/${path}`}>{title}</LightBlueLink>
              </li>
            ))}
          </ul>
        </SectionPaper>
      </SectionContainer>
    </>
  );
}

export default Publication;

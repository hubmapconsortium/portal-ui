import React from 'react';
import Typography from '@material-ui/core/Typography';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import Summary from 'js/components/genes/Summary';
import { FlexRow, Content } from './style';

function Genes() {
  const summaryId = 'Summary';
  const hraId = 'Human Reference Atlas';
  const referenceId = 'Reference-Based Analysis';
  const assaysId = 'Assays';
  const samplesId = 'Samples';

  const shouldDisplaySection = {
    [summaryId]: true,
    [hraId]: true,
    [referenceId]: true,
    [assaysId]: true,
    [samplesId]: true,
  };

  const sectionOrder = Object.entries(shouldDisplaySection)
    .filter(([, shouldDisplay]) => shouldDisplay)
    .map(([sectionName]) => sectionName);
  const sections = new Map(getSections(sectionOrder));

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <Content>
        <Typography variant="subtitle1" component="h1" color="primary">
          Gene
        </Typography>
        <Typography variant="h1" component="h2">
          CD4
        </Typography>
        <Summary />
      </Content>
    </FlexRow>
  );
}

export default Genes;

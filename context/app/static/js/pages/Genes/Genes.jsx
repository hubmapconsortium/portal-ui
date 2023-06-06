import React from 'react';
import Typography from '@material-ui/core/Typography';

import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';

import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import HumanReferenceAtlas from 'js/components/organ/HumanReferenceAtlas';
import Samples from 'js/components/organ/Samples';
import DatasetsBarChart from 'js/components/organ/OrganDatasetsChart';
import Section from 'js/shared-styles/sections/Section';

import { FlexRow, Content } from './style';

function Organ() {
  const summaryId = 'Summary';
  const hraId = 'Human Reference Atlas';
  const referenceId = 'Reference-Based Analysis';
  const assaysId = 'Assays';
  const samplesId = 'Samples';

  //   const shouldDisplaySearch = organ.search.length > 0;

  //   const shouldDisplaySection = {
  //     [summaryId]: Boolean(organ?.description),
  //     [hraId]: organ.has_iu_component,
  //     [referenceId]: Boolean(organ?.azimuth),
  //     [assaysId]: shouldDisplaySearch,
  //     [samplesId]: shouldDisplaySearch,
  //   };

  const shouldDisplaySection = {
    [summaryId]: 'Boolean(organ?.description)',
    [hraId]: 'organ.has_iu_component',
    [referenceId]: 'Boolean(organ?.azimuth)',
    [assaysId]: 'shouldDisplaySearch',
    [samplesId]: 'shouldDisplaySearch',
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
          Organ
        </Typography>
        <Typography variant="h1" component="h2">
          {/* {organ.name} */}
        </Typography>
        <Section id={summaryId}>
          {/* <Description uberonIri={organ.uberon} uberonShort={organ.uberon_short} asctbId={organ.asctb}> */}
          <Description>{/* {organ.description} */}</Description>
        </Section>
        <Section id={hraId}>
          {/* <HumanReferenceAtlas uberonIri={organ.uberon} /> */}
          <HumanReferenceAtlas />
        </Section>
        <Section id={referenceId}>
          {/* <Azimuth config={organ.azimuth} /> */}
          <Azimuth />
        </Section>
        <Section id={assaysId}>
          {/* <Assays organTerms={organ.search} /> */}
          <Assays />
          {/* <DatasetsBarChart name={organ.name} search={organ.search} /> */}
          <DatasetsBarChart />
        </Section>
        <Section id={samplesId}>
          {/* <Samples organTerms={organ.search} /> */}
          <Samples />
        </Section>
      </Content>
    </FlexRow>
  );
}

export default Organ;

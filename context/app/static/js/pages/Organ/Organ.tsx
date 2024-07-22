import React from 'react';
import Typography from '@mui/material/Typography';

import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import HumanReferenceAtlas from 'js/components/organ/HumanReferenceAtlas';
import Samples from 'js/components/organ/Samples';
import DatasetsBarChart from 'js/components/organ/OrganDatasetsChart';
import Section from 'js/shared-styles/sections/Section';
import { OrganFile } from 'js/components/organ/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';

interface OrganProps {
  organ: OrganFile;
}

const summaryId = 'Summary';
const hraId = 'Human Reference Atlas';
const referenceId = 'Reference-Based Analysis';
const assaysId = 'Assays';
const samplesId = 'Samples';

function Organ({ organ }: OrganProps) {
  const shouldDisplaySearch = Boolean(organ.search.length > 0);

  const shouldDisplaySection: Record<string, boolean> = {
    [summaryId]: Boolean(organ?.description),
    [hraId]: Boolean(organ.has_iu_component),
    [referenceId]: Boolean(organ?.azimuth),
    [assaysId]: shouldDisplaySearch,
    [samplesId]: shouldDisplaySearch,
  };

  return (
    <DetailLayout sections={shouldDisplaySection}>
      <Typography variant="subtitle1" component="h1" color="primary">
        Organ
      </Typography>
      <Typography variant="h1" component="h2">
        {organ.name}
      </Typography>
      {shouldDisplaySection[summaryId] && (
        <Section id={summaryId}>
          <Description uberonIri={organ.uberon} uberonShort={organ.uberon_short} asctbId={organ.asctb}>
            {organ.description}
          </Description>
        </Section>
      )}
      {shouldDisplaySection[hraId] && (
        <Section id={hraId}>
          <HumanReferenceAtlas uberonIri={organ.uberon} />
        </Section>
      )}
      {shouldDisplaySection[referenceId] && (
        <Section id={referenceId}>
          <Azimuth config={organ.azimuth} />
        </Section>
      )}
      {shouldDisplaySection[assaysId] && (
        <Section id={assaysId}>
          <Assays organTerms={organ.search} />
          <DatasetsBarChart search={organ.search} />
        </Section>
      )}
      {shouldDisplaySection[samplesId] && (
        <Section id={samplesId}>
          <Samples organTerms={organ.search} />
        </Section>
      )}
    </DetailLayout>
  );
}

export default Organ;

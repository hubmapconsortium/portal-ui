import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';

import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import HumanReferenceAtlas from 'js/components/organ/HumanReferenceAtlas';
import Samples from 'js/components/organ/Samples';
import { OrganFile } from 'js/components/organ/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import CellPopulationPlot from 'js/components/organ/CellPop';
import DataProducts from 'js/components/organ/DataProducts';
import { useAssayBucketsQuery, useHasSamplesQuery, useLabelledDatasetsQuery } from './hooks';

interface OrganProps {
  organ: OrganFile;
}

const summaryId = 'summary';
const hraId = 'human-reference-atlas';
const referenceId = 'reference-based-analysis';
const assaysId = 'assays';
const dataProductsId = 'data-products';
const samplesId = 'samples';
const cellpopId = 'cell-population-plot';

function Organ({ organ }: OrganProps) {
  const searchItems = useMemo(
    () => (organ.search.length > 0 ? organ.search : [organ.name]),
    [organ.search, organ.name],
  );

  const assayBuckets = useAssayBucketsQuery(searchItems);
  const samplesHits = useHasSamplesQuery(searchItems);
  const labeledDatasetUuids = useLabelledDatasetsQuery(searchItems);

  const shouldDisplaySection: Record<string, boolean> = {
    [summaryId]: Boolean(organ?.description),
    [hraId]: Boolean(organ.has_iu_component),
    [cellpopId]: labeledDatasetUuids.length > 0,
    [referenceId]: Boolean(organ?.azimuth),
    [assaysId]: assayBuckets.length > 0,
    [dataProductsId]: true,
    [samplesId]: samplesHits.length > 0,
  };

  return (
    <DetailLayout sections={shouldDisplaySection}>
      <Typography variant="subtitle1" component="h1" color="primary" data-testid="entity-title">
        Organ
      </Typography>
      <Typography variant="h1" component="h2">
        {organ.name}
      </Typography>
      <Description
        id={summaryId}
        uberonIri={organ.uberon}
        uberonShort={organ.uberon_short}
        asctbId={organ.asctb}
        shouldDisplay={shouldDisplaySection[summaryId]}
      >
        {organ.description}
      </Description>
      <HumanReferenceAtlas id={hraId} uberonIri={organ.uberon} shouldDisplay={shouldDisplaySection[hraId]} />
      <CellPopulationPlot id={cellpopId} uuids={labeledDatasetUuids} shouldDisplay={shouldDisplaySection[cellpopId]} />
      <Azimuth id={referenceId} config={organ.azimuth!} shouldDisplay={shouldDisplaySection[referenceId]} />
      <Assays
        id={assaysId}
        organTerms={searchItems}
        bucketData={assayBuckets}
        shouldDisplay={shouldDisplaySection[assaysId]}
      />
      <DataProducts id={dataProductsId} />
      <Samples id={samplesId} organTerms={searchItems} shouldDisplay={shouldDisplaySection[samplesId]} />
    </DetailLayout>
  );
}

export default Organ;

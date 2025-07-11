import React from 'react';
import Typography from '@mui/material/Typography';

import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import CellTypes from 'js/components/organ/OrganCellTypes';
import Description from 'js/components/organ/Description';
import HumanReferenceAtlas from 'js/components/organ/HumanReferenceAtlas';
import Samples from 'js/components/organ/Samples';
import { OrganFile, OrganPageIds } from 'js/components/organ/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import CellPopulationPlot from 'js/components/organ/CellPop';
import DataProducts from 'js/components/organ/DataProducts';
import { OrganContextProvider } from 'js/components/organ/contexts';
import {
  useAssayBucketsQuery,
  useDataProducts,
  useHasSamplesQuery,
  useLabelledDatasetsQuery,
  useCellTypesOfOrgan,
  useSearchItems,
} from './hooks';

interface OrganProps {
  organ: OrganFile;
}

const { summaryId, hraId, cellpopId, cellTypesId, referenceId, assaysId, dataProductsId, samplesId } = OrganPageIds;

function Organ({ organ }: OrganProps) {
  const searchItems = useSearchItems(organ);
  const assayBuckets = useAssayBucketsQuery(searchItems);
  const samplesHits = useHasSamplesQuery(searchItems);
  const labeledDatasetUuids = useLabelledDatasetsQuery(searchItems);
  const { dataProducts, isLoading, isLateral } = useDataProducts(organ);
  const cellTypes = useCellTypesOfOrgan(organ.name);

  const shouldDisplaySection: Record<string, boolean> = {
    [summaryId]: Boolean(organ?.description),
    [hraId]: Boolean(organ.has_iu_component),
    [cellpopId]: labeledDatasetUuids.length > 0,
    [cellTypesId]: cellTypes.length > 0,
    [referenceId]: Boolean(organ?.azimuth),
    [assaysId]: assayBuckets.length > 0,
    [dataProductsId]: dataProducts.length > 0,
    [samplesId]: samplesHits.length > 0,
  };

  return (
    <OrganContextProvider organ={organ}>
      <DetailLayout sections={shouldDisplaySection} isLoading={isLoading}>
        <Typography variant="subtitle1" component="h1" color="primary" data-testid="entity-title">
          Organ
        </Typography>
        <Typography variant="h1" component="h2">
          {organ.name}
        </Typography>
        <Description shouldDisplay={shouldDisplaySection[summaryId]} />
        <HumanReferenceAtlas shouldDisplay={shouldDisplaySection[hraId]} />
        <CellPopulationPlot
          uuids={labeledDatasetUuids}
          shouldDisplay={shouldDisplaySection[cellpopId]}
          organ={organ.name}
        />
        <CellTypes shouldDisplay={shouldDisplaySection[cellTypesId]} cellTypes={cellTypes} />
        <Azimuth shouldDisplay={shouldDisplaySection[referenceId]} />
        <Assays organTerms={searchItems} bucketData={assayBuckets} shouldDisplay={shouldDisplaySection[assaysId]} />
        <DataProducts
          dataProducts={dataProducts}
          isLateral={isLateral}
          isLoading={isLoading}
          shouldDisplay={shouldDisplaySection[dataProductsId]}
        />
        <Samples organTerms={searchItems} shouldDisplay={shouldDisplaySection[samplesId]} />
      </DetailLayout>
    </OrganContextProvider>
  );
}

export default Organ;

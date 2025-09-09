import React, { useCallback } from 'react';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import { capitalize } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';
import { CollapsibleDetailPageSection } from '../detailPage/DetailPageSection';
import MolecularDataQueryFormProvider from '../cells/MolecularDataQueryForm/MolecularDataQueryFormProvider';
import MolecularDataQueryFormTrackingProvider from '../cells/MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import { useCellTypesDetailPageContext } from './CellTypesDetailPageContext';
import { SCFindCellTypeQueryResults } from '../cells/SCFindResults';

function CellTypesEntitiesTables() {
  const { cellTypes, name, trackingInfo } = useCellTypesDetailPageContext();
  const formattedTitle = name
    ? `Datasets Containing ${name
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ')}`
    : 'Datasets';

  const trackExploreWithMolecularAndCellularQueryTool = useCallback(() => {
    trackEvent({
      ...trackingInfo,
      action: 'Datasets / Select "Explore with Molecular and Cellular Query" button',
    });
  }, [trackingInfo]);

  return (
    <CollapsibleDetailPageSection title={formattedTitle} id="datasets" trackingInfo={trackingInfo}>
      <Description
        belowTheFold={
          <Box mt={2}>
            <Button
              href="/search/biomarkers-cell-types"
              variant="contained"
              color="primary"
              onClick={trackExploreWithMolecularAndCellularQueryTool}
            >
              Explore with Biomarker and Cell Type Search Tool
            </Button>
          </Box>
        }
      >
        These are datasets that contain this cell type as identified by Azimuth and indexed by the <SCFindLink /> with
        uniformly processed HuBMAP RNAseq datasets that contain cell type annotations. The datasets overview plot
        displays an overview of the datasets metadata compared to either the indexed datasets or all the HuBMAP datasets
        available. The table is available for download in TSV format for further analysis.
      </Description>
      <Box py={1} />
      <MolecularDataQueryFormTrackingProvider category="Cell Type Detail Page">
        <MolecularDataQueryFormProvider
          initialValues={{
            queryType: 'cell-type',
            queryMethod: 'scFind',
            cellTypes: cellTypes.map((cellType) => ({
              full: cellType,
              pre: '',
              match: cellType,
              post: '',
            })),
          }}
        >
          <SelectableTableProvider tableLabel={`Datasets with ${name} - scFind Results`}>
            <SCFindCellTypeQueryResults
              trackingInfo={{
                ...trackingInfo,
                action: 'Datasets',
              }}
            />
          </SelectableTableProvider>
        </MolecularDataQueryFormProvider>
      </MolecularDataQueryFormTrackingProvider>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CellTypesEntitiesTables);

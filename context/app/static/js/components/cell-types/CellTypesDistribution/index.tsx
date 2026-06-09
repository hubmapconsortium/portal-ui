import React, { useState } from 'react';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import Description from 'js/shared-styles/sections/Description';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { capitalize } from '@mui/material/utils';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { CollapsibleDetailPageSection } from '../../detailPage/DetailPageSection';
import { SCFindModalityProvider } from '../../cells/SCFindResults/SCFindModalityContext';
import { useCellTypesDetailPageContext } from '../CellTypesDetailPageContext';
import CellTypeDistributionChart from '../../cells/CellTypeDistributionChart';
import MultiOrganCellTypeDistributionChart from './MultiOrganCellTypesDistributionChart';

function Chart() {
  const { organs, cellTypes } = useCellTypesDetailPageContext();
  const { openTabIndex, handleTabChange } = useTabs();
  // RNA/ATAC selection is shared across all tabs: the multi-organ chart's toggle drives it, and the
  // per-organ single charts read it via SCFindModalityProvider.
  const [dataType, setDataType] = useState<SCFindModality>(undefined);

  // Tab 0 is the multi-organ chart (default); tabs 1..N are individual organs' fraction charts.
  return (
    <>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant={organs.length >= 4 ? 'scrollable' : 'fullWidth'}>
        <Tab label="All Organs" index={0} />
        {organs.map((organ, idx) => (
          <Tab
            key={organ}
            index={idx + 1}
            iconPosition="start"
            label={
              <Stack direction="row" alignItems="center" gap={1}>
                <Box flexShrink={0}>
                  <OrganIcon organName={organ} />
                </Box>
                <Box component="span" sx={{ textTransform: 'capitalize' }}>
                  {capitalize(organ)}
                </Box>
              </Stack>
            }
          />
        ))}
      </Tabs>
      <TabPanel value={openTabIndex} index={0}>
        <MultiOrganCellTypeDistributionChart
          organs={organs}
          cellTypes={cellTypes}
          hideLinks
          dataType={dataType}
          onDataTypeChange={setDataType}
        />
      </TabPanel>
      {organs.map((organ, idx) => (
        <TabPanel key={organ} value={openTabIndex} index={idx + 1}>
          <SCFindModalityProvider value={dataType}>
            <Paper sx={{ p: 2 }}>
              <CellTypeDistributionChart tissue={organ} cellTypes={cellTypes} skipDescription />
            </Paper>
          </SCFindModalityProvider>
        </TabPanel>
      ))}
    </>
  );
}

function CellTypesDistribution() {
  const { trackingInfo } = useCellTypesDetailPageContext();
  return (
    <CollapsibleDetailPageSection
      title="Cell Type Distribution"
      id="cell-type-distribution"
      trackingInfo={trackingInfo}
    >
      <Description>
        This visualization displays the distribution of the cell type across the available organs, as identified by
        Azimuth and indexed by the <SCFindLink />. Only organs that contain at least one indexable dataset containing
        this cell type are included.
      </Description>
      <Chart />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CellTypesDistribution);

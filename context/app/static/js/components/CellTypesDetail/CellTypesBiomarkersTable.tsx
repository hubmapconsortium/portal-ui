import React from 'react';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { DetailPageSection } from '../detailPage/style';
import { useCellTypeInfo } from './hooks';

export default function CellTypesBiomarkersTable() {
  const { data } = useCellTypeInfo();
  const biomarkers = data?.biomarkers ?? [];
  const biomarkerSources = biomarkers
    .map((biomarker) => biomarker.reference)
    .filter((source, index, self) => self.indexOf(source) === index);

  return (
    <DetailPageSection>
      <SectionHeader>Biomarkers</SectionHeader>
      <Stack direction="column" spacing={2}>
        <Description>
          This is a list of identified biomarkers that are validated from the listed source. Explore other sources in
          dropdown menu below, if available.
        </Description>
        <Select label="Source" value="Human Reference Atlas" fullWidth>
          {biomarkerSources.map((source) => (
            <MenuItem key={source} value={source}>
              {source}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </DetailPageSection>
  );
}

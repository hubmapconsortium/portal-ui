import React from 'react';
import Typography from '@mui/material/Typography';

import DonorChart from './DonorChart';
import ProjectAttribution from './ProjectAttribution';
import { PageTitleWrapper, PageTitle, DescriptionPaper } from './style';

function Diversity() {
  return (
    <>
      <PageTitleWrapper>
        <PageTitle>HuBMAP Donor Diversity</PageTitle>
        <DescriptionPaper>
          <Typography>
            The goal of HuBMAP is to develop an open and global platform to map healthy cells in the human body. To
            serve as a reference atlas for future studies in human disease, HuBMAP needs to include a diverse of donors
            representing a broad spectrum of factors affecting health. These include age, sex, race, race, ethnicity,
            and many other factors. The visualizations on this page provide an overview of the distribution of these
            factors across all HuBMAP donors.
          </Typography>
        </DescriptionPaper>
      </PageTitleWrapper>

      <DonorChart xAxis="age" groups="race" />
      <DonorChart xAxis="blood_type" groups="race" />
      <DonorChart xAxis="sex" groups="race" />
      <DonorChart xAxis="blood_type" groups="sex" />
      <DonorChart xAxis="age" groups="sex" />

      <ProjectAttribution />
    </>
  );
}

export default Diversity;

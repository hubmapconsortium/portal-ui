import React from 'react';
import Typography from '@material-ui/core/Typography';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';

import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import OrganInfo from 'js/components/organ/OrganInfo';
import Samples from 'js/components/organ/Samples';
import DatasetsBarChart from 'js/components/organ/OrganDatasetsChart';

import { FlexRow, Content } from './style';

function Organ(props) {
  const { organ } = props;

  const [descriptionId, organInfoId, azimuthId, searchId] = ['description', 'organ info', 'azimuth', 'search'];

  const shouldDisplaySection = {
    [descriptionId]: Boolean(organ?.description),
    [organInfoId]: organ.has_iu_component,
    [azimuthId]: Boolean(organ?.azimuth),
    [searchId]: organ.search.length > 0,
  };

  const sectionOrder = Object.entries(shouldDisplaySection)
    .filter(([, shouldDisplay]) => shouldDisplay)
    .map(([sectionName]) => sectionName);
  const sections = new Map(getSections(sectionOrder));

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <Content>
        <Typography variant="subtitle1" color="primary">
          Organ
        </Typography>
        <SectionHeader variant="h1">{organ.name}</SectionHeader>
        {shouldDisplaySection[descriptionId] && (
          <div id={descriptionId}>
            <Description uberonIri={organ.uberon} uberonShort={organ.uberon_short}>
              {organ.description}
            </Description>
          </div>
        )}
        {shouldDisplaySection[organInfoId] && (
          <div id={organInfoId}>
            <OrganInfo uberonIri={organ.uberon} />
          </div>
        )}
        {shouldDisplaySection[azimuthId] && (
          <div id={azimuthId}>
            <Azimuth config={organ.azimuth} />
          </div>
        )}
        {shouldDisplaySection[searchId] && (
          <div id={searchId}>
            <Assays searchTerms={organ.search} />
            <DatasetsBarChart name={organ.name} search={organ.search} />
            <Samples searchTerms={organ.search} />
          </div>
        )}
      </Content>
    </FlexRow>
  );
}

export default Organ;

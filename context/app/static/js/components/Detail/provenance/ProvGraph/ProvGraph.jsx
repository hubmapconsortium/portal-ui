import React from 'react';
import PropTypes from 'prop-types';

import SectionItem from 'js/components/Detail/SectionItem';
import { LightBlueLink } from 'js/shared-styles/Links';
import ProvVis from '../ProvVis';
import { StyledTypography, FlexPaper } from './style';
import '@hms-dbmi-bgm/react-workflow-viz/dist/react-workflow-viz.min.css';

function ProvGraph(props) {
  const { provData, display_doi } = props;
  const isOld = 'ex' in provData.prefix;
  const idKey = isOld ? 'hubmap:displayDOI' : 'hubmap:hubmap_id';
  const timeKey = isOld ? 'prov:generatedAtTime' : 'hubmap:created_timestamp';
  const typeKey = isOld ? 'prov:type' : 'hubmap:entity_type';

  function getNameForActivity(id, prov) {
    const activity = prov.activity[id];
    return `${activity['hubmap:creation_action']} - ${activity[idKey]}`;
  }

  function getNameForEntity(id, prov) {
    const entity = prov.entity[id];
    // NOTE: The initial entity node was not included in the sample data;
    // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
    return entity ? `${entity[typeKey]} - ${entity[idKey]}` : id;
  }

  function renderDetailPane(prov) {
    const typeEl =
      typeKey in prov ? (
        <SectionItem label="Type">
          <StyledTypography variant="body1">{prov[typeKey]}</StyledTypography>
        </SectionItem>
      ) : (
        <SectionItem label="Type">
          <StyledTypography variant="body1">{prov['prov:type']}</StyledTypography>
        </SectionItem>
      );
    const idEl =
      typeKey in prov && ['Donor', 'Sample', 'Dataset'].includes(prov[typeKey]) ? (
        <SectionItem label="ID" ml>
          <StyledTypography variant="body1">
            <LightBlueLink href={`/browse/${prov[typeKey].toLowerCase()}/${prov['hubmap:uuid']}`}>
              {prov[idKey]}
            </LightBlueLink>
          </StyledTypography>
        </SectionItem>
      ) : null;
    const createdEl =
      timeKey in prov ? (
        <SectionItem label="Created" ml>
          <StyledTypography variant="body1">{prov[timeKey]}</StyledTypography>
        </SectionItem>
      ) : null;
    return (
      <FlexPaper>
        {typeEl}
        {idEl}
        {createdEl}
      </FlexPaper>
    );
  }

  return (
    <ProvVis
      provData={provData}
      display_doi={display_doi}
      getNameForActivity={getNameForActivity}
      getNameForEntity={getNameForEntity}
      renderDetailPane={renderDetailPane}
    />
  );
}

ProvGraph.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ProvGraph;

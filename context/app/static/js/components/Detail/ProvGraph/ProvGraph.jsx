import React from 'react';
import PropTypes from 'prop-types';
import ProvVis from '../../ProvVis';
import { StyledTypography, StyledLink, FlexPaper } from './style';
import SectionItem from '../SectionItem';
import '@hms-dbmi-bgm/react-workflow-viz/dist/react-workflow-viz.min.css';

function ProvGraph(props) {
  const { provData } = props;
  function getNameForActivity(id, prov) {
    const activity = prov.activity[id];
    return `${activity['prov:type']} - ${activity['hubmap:displayDOI']}`;
  }
  function getNameForEntity(id, prov) {
    const entity = prov.entity[id];
    // NOTE: The initial entity node was not included in the sample data;
    // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
    return entity ? `${entity['prov:type']} - ${entity['hubmap:displayDOI']}` : id;
  }
  function renderDetailPane(prov) {
    const typeEl =
      'prov:type' in prov ? (
        <SectionItem label="Type">
          <StyledTypography variant="body1">{prov['prov:type']}</StyledTypography>
        </SectionItem>
      ) : (
        <SectionItem label="Type">
          <StyledTypography variant="body1">Root</StyledTypography>
        </SectionItem>
      );
    const idEl =
      'prov:type' in prov && ['Donor', 'Sample', 'Dataset'].includes(prov['prov:type']) ? (
        <SectionItem label="ID" ml>
          <StyledTypography variant="body1">
            <StyledLink href={`/browse/${prov['prov:type'].toLowerCase()}/${prov['hubmap:uuid']}`}>
              {prov['hubmap:displayDOI']}
            </StyledLink>
          </StyledTypography>
        </SectionItem>
      ) : null;
    const createdEl =
      'prov:generatedAtTime' in prov ? (
        <SectionItem label="Created" ml>
          <StyledTypography variant="body1">{prov['prov:generatedAtTime']}</StyledTypography>
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
      prov={provData}
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

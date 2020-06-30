import React from 'react';
import PropTypes from 'prop-types';
import hubmapProvVis from '@hubmap/prov-vis';
import { StyledTypography, StyledLink, FlexPaper } from './style';
import SectionItem from '../SectionItem';
import '@hms-dbmi-bgm/react-workflow-viz/dist/react-workflow-viz.min.css';

function ProvGraph(props) {
  const { provData } = props;
  const runRenderProvVis = () =>
    hubmapProvVis.renderProvVis('prov-vis-react', provData, {
      getNameForActivity: (id, prov) => {
        const activity = prov.activity[id];
        return `${activity['prov:type']} - ${activity['hubmap:displayDOI']}`;
      },
      getNameForEntity: (id, prov) => {
        const entity = prov.entity[id];
        // NOTE: The initial entity node was not included in the sample data;
        // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
        return entity ? `${entity['prov:type']} - ${entity['hubmap:displayDOI']}` : id;
      },
      renderDetailPane: (prov) => {
        const href = `/browse/${prov['prov:type'].toLowerCase()}/${prov['hubmap:uuid']}`;
        return (
          <FlexPaper>
            <SectionItem label="Type">
              <StyledTypography variant="body1">{prov['prov:type']}</StyledTypography>
            </SectionItem>
            <SectionItem label="ID" ml>
              <StyledTypography variant="body1">
                <StyledLink href={href}>{prov['hubmap:displayDOI']}</StyledLink>
              </StyledTypography>
            </SectionItem>
            <SectionItem label="Created" ml>
              <StyledTypography variant="body1">{prov['prov:generatedAtTime']}</StyledTypography>
            </SectionItem>
          </FlexPaper>
        );
      },
    });
  return setTimeout(runRenderProvVis, 0);
}

ProvGraph.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ProvGraph;

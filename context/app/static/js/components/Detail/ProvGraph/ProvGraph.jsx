import React from 'react';
import PropTypes from 'prop-types';
import hubmapProvVis from '@hubmap/prov-vis';
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
          <table>
            <tr>
              <td>Type</td>
              <td>{prov['prov:type']}</td>
            </tr>
            <tr>
              <td>ID</td>
              <td>
                <a href={href}>{prov['hubmap:displayDOI']}</a>
              </td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{prov['prov:generatedAtTime']}</td>
            </tr>
          </table>
        );
      },
    });
  return setTimeout(runRenderProvVis, 0);
}

ProvGraph.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ProvGraph;

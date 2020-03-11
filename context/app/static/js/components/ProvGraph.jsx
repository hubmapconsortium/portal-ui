import React from 'react';
import hubmapProvVis from '@hubmap/prov-vis';

export default function ProvGraph(props) {
  const provData = props;
  const runRenderProvVis = () => hubmapProvVis.renderProvVis(
    'prov-vis-react',
    provData,
    {
      getNameForActivity: (id, prov) => {
        const activity = prov.activity[id];
        return `${activity['prov:type']} - ${activity['prov:label']}`;
      },
      getNameForEntity: (id, prov) => {
        const entity = prov.entity[id];
        // NOTE: The initial entity node was not included in the sample data;
        // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
        return entity ? `${entity['prov:type']} - ${entity['prov:label']}` : id;
      },
      renderDetailPane: (prov) => {
        function create(tag, props, children) { // eslint-disable-line no-shadow
          return React.createElement(tag, props, children);
        }

        return create(
          'table',
          { className: 'table table-bordered table-sm' },
          ['prov:type', 'hubmap:uuid', 'prov:generatedAtTime'].map((field) => create('tr', null, [
            create('td', { className: 'td-key' }, field),
            create('td', { className: 'td-value' },
              field === 'hubmap:uuid'
                ? create('a', { href: prov[field] }, prov[field])
                : prov[field]),
          ])),
        );
      },
    },
  );
  return setTimeout(runRenderProvVis, 0);
}

import React from 'react';
// eslint-disable-next-line import/no-unresolved
import useWindowSize from 'hooks/useWindowSize';
import BarChart from '../BarChart';
import { Placeholder } from './style';

const data = [
  { doc_count: 5, key: 'AF-bulk' },
  { doc_count: 10, key: 'ATACseq-bulk' },
  { doc_count: 22, key: 'MxIF' },
  { doc_count: 31, key: 'CODEX' },
  { doc_count: 2, key: 'IMC' },
  { doc_count: 14, key: 'MALDI-IMS-neg' },
  { doc_count: 19, key: 'MALDI-IMS-pos' },
  { doc_count: 7, key: 'PAS' },
  { doc_count: 23, key: 'bulk-RNA' },
  { doc_count: 4, key: 'SNAREseq' },
  { doc_count: 29, key: 'TMT-LC-MS' },
  { doc_count: 7, key: 'Targeted-Shotgun-LC-MS' },
  { doc_count: 12, key: 'LC-MS-untargeted' },
  { doc_count: 22, key: 'WGS' },
  { doc_count: 16, key: 'scRNA-Seq-10x' },
  { doc_count: 8, key: 'sciATACseq' },
  { doc_count: 4, key: 'sciRNAseq' },
  { doc_count: 14, key: 'seqFish' },
  { doc_count: 6, key: 'snATACseq' },
  { doc_count: 18, key: 'snRNAseq' },
  { doc_count: 19, key: 'codex_cytokit' },
  { doc_count: 44, key: 'salmon_rnaseq_10x' },
  { doc_count: 4, key: 'Lightsheet' },
];

const partialSpec = {
  // width: 1000,
  // height: 600,
  encoding: {
    x: {
      field: 'key',
      type: 'ordinal',
      axis: { labelAngle: '-75', titleFontWeight: 300, titleFontSize: 12, ticks: true, labelOverlap: true },
      scale: { paddingInner: 0.4 },
      title: 'ASSAY TYPE',
      sort: '-y',
    },
    y: {
      field: 'doc_count',
      type: 'quantitative',
      axis: { tickCount: 6, titleFontWeight: 300, titleFontSize: 12 },
      title: 'DATASETS',
    },
  },
  config: { background: '#fafafa', bar: { color: '#9CB965' } },
  layer: [
    {
      mark: 'bar',
    },
    {
      mark: {
        type: 'text',
        align: 'center',
        baseline: 'middle',
        dy: -6,
        fontSize: 12,
      },
      encoding: {
        text: { field: 'doc_count', type: 'quantitative' },
      },
    },
  ],
};

function BarChartWrapper() {
  const windowWidth = useWindowSize().width;
  const containerWidth = Math.min(windowWidth, 1200);
  const chartWidth = containerWidth - 200;
  const chartHeight = chartWidth * 0.6;
  const spec = { ...partialSpec, width: chartWidth, height: chartHeight };
  return (
    <Placeholder>
      <BarChart data={data} spec={spec} />
    </Placeholder>
  );
}

export default BarChartWrapper;

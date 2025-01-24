import React from 'react';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutlinedButton from 'js/shared-styles/buttons/OutlinedButton';

export default function CellPopDescription() {
  return (
    <SectionDescription
      addendum={[
        <LabelledSectionText label="Basic Exploration" key="basic-exploration">
          Hover over any items in the plot to reveal additional information about the data. Toggle to select either
          columns or rows to adjust the plot as needed. Toggle between bar charts and violin plots to display either the
          total count of cells or their fractional distributions.
        </LabelledSectionText>,
        <LabelledSectionText label="Plot Controls" key="plot-controls">
          Use the plot controls to modify sorting preferences or display options. Display options include toggling the
          visibility of a specific column or row, or embedding a bar chart to compare the amounts of cell types within a
          dataset.
        </LabelledSectionText>,
        <LabelledSectionText label="Relevant Pages" key="relevant-pages">
          <OutlinedButton color="info">Tutorial</OutlinedButton>
        </LabelledSectionText>,
      ]}
    >
      This interactive heatmap visualizes cell populations in datasets from this organ. Cell type annotations are from
      Azimuth. Key features are highlighted below and a tutorial is available.
    </SectionDescription>
  );
}

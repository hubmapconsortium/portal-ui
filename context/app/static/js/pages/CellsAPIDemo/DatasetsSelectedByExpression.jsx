import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';

import ResultsTable from './ResultsTable';
import CellsService from './CellsService';
import AutocompleteEntity from './AutocompleteEntity';

// eslint-disable-next-line no-unused-vars
function DatasetsSelectedByExpression(props) {
  const [geneNames, setGeneNames] = useState([]);
  const [targetEntity, setTargetEntity] = useState('gene'); // eslint-disable-line no-unused-vars
  const [modality, setModality] = useState('rna'); // eslint-disable-line no-unused-vars
  const [minExpression, setMinExpression] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(10);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    try {
      if (targetEntity === 'gene') {
        const serviceResults = await new CellsService().getDatasetsSelectedByGenes({
          geneNames,
          minExpression,
          minCellPercentage,
          modality,
        });
        setResults(serviceResults);
      } else {
        throw Error(`Datasets by "${targetEntity}" unimplemented`);
      }
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <Paper>
      <AutocompleteEntity targetEntity="genes" setter={setGeneNames} />

      <br />

      <FormLabel id="min-gene-expression-label">Minimum gene expression</FormLabel>
      <SliderWrapper
        value={minExpression}
        min={0}
        max={100}
        marks={[0, 12.5, 25, 50, 100]}
        setter={setMinExpression}
        labelledby="min-gene-expression-label"
      />

      <FormLabel id="min-cell-percentage-label">Minimum cell percentage</FormLabel>
      <SliderWrapper
        value={minCellPercentage}
        min={0}
        max={100}
        marks={[0, 12.5, 25, 50, 100]}
        setter={setMinCellPercentage}
        labelledby="min-cell-percentage-label"
      />

      <br />
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      {message}
      <ResultsTable results={results} />
    </Paper>
  );
}

function SliderWrapper(props) {
  const { value, min, max, marks, setter, labelledby } = props;
  return (
    <Slider
      value={value}
      min={min}
      max={max}
      valueLabelDisplay="auto"
      step={null} /* Constrains choices to the mark values. */
      marks={marks.map((m) => ({ value: m, label: m }))}
      onChange={(e, val) => {
        setter(val);
      }}
      aria-labelledby={labelledby}
    />
  );
}

export default DatasetsSelectedByExpression;

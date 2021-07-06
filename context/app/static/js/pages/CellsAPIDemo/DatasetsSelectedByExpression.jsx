import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';

import ResultsTable from './ResultsTable';
import CellsService from './CellsService';

// eslint-disable-next-line no-unused-vars
function DatasetsSelectedByExpression(props) {
  const [name, setName] = useState('VIM');
  const [targetEntity, setTargetEntity] = useState('gene'); // eslint-disable-line no-unused-vars
  const [modality, setModality] = useState('rna'); // eslint-disable-line no-unused-vars
  const [minExpression, setMinExpression] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(10);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    try {
      if (targetEntity === 'gene') {
        const serviceResults = await new CellsService().getDatasetsSelectedByGene({
          geneName: name,
          minExpression,
          minCellPercentage,
        });
        setResults(serviceResults);
      } else {
        throw Error(`Datasets by "${targetEntity}" unimplemented`);
      }
    } catch (e) {
      setMessage(e.message);
    }
  }

  function handleChange(event) {
    const { target } = event;
    const setFields = {
      name: setName,
      minExpression: setMinExpression,
      minCellPercentage: setMinCellPercentage,
    };
    setFields[target.name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="name" value={name} name="name" variant="outlined" onChange={handleChange} />

      <br />

      <FormLabel id="min-gene-expression-label">Minimum gene expression</FormLabel>
      <SliderWrapper
        value={minExpression}
        min={0}
        max={100}
        setter={setMinExpression}
        labelledby="min-gene-expression-label"
      />

      <FormLabel id="min-cell-percentage-label">Minimum cell percentage</FormLabel>
      <SliderWrapper
        value={minCellPercentage}
        min={0}
        max={100}
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
  const { value, min, max, setter, labelledby } = props;
  return (
    <Slider
      value={value}
      min={min}
      max={max}
      valueLabelDisplay="auto"
      marks={[
        { value: min, label: min },
        { value: max, label: max },
      ]}
      onChange={(e, val) => {
        setter(val);
      }}
      aria-labelledby={labelledby}
    />
  );
}

export default DatasetsSelectedByExpression;

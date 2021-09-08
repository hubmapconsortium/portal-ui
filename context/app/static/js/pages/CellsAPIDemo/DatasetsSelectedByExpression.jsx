import React, { useState, useMemo } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';

import LogSliderWrapper from 'js/components/cells/LogSliderWrapper';
import CellsService from './CellsService';
import AutocompleteEntity from './AutocompleteEntity';
import { useSearchHits } from '../../hooks/useSearchData';
import DatasetsTable from './DatasetsTable';

// eslint-disable-next-line no-unused-vars
function DatasetsSelectedByExpression(props) {
  const [geneNames, setGeneNames] = useState([]);
  const [targetEntity, setTargetEntity] = useState('gene'); // eslint-disable-line no-unused-vars
  const [modality, setModality] = useState('rna'); // eslint-disable-line no-unused-vars
  const [minExpressionLog, setMinExpressionLog] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(10);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    try {
      if (targetEntity === 'gene') {
        const serviceResults = await new CellsService().getDatasetsSelectedByGenes({
          geneNames,
          minExpression: 10 ** minExpressionLog,
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
  const query = useMemo(() => {
    return {
      query: {
        bool: {
          must_not: {
            exists: {
              field: 'next_revision_uuid',
            },
          },
        },
      },
      post_filter: {
        bool: {
          must: [
            {
              term: {
                'entity_type.keyword': 'Dataset',
              },
            },
            {
              terms: {
                uuid: results.map((result) => result.uuid),
              },
            },
          ],
        },
      },
      _source: [
        'uuid',
        'hubmap_id',
        'mapped_data_types',
        'origin_sample.mapped_organ',
        'donor.mapped_metadata',
        'last_modified_timestamp',
      ],
    };
  }, [results]);

  const { searchHits } = useSearchHits(query);

  return (
    <Paper>
      <AutocompleteEntity targetEntity="genes" setter={setGeneNames} />

      <br />

      <FormLabel id="min-gene-expression-label">Minimum gene expression</FormLabel>
      <LogSliderWrapper
        value={minExpressionLog}
        minLog={-4}
        maxLog={5}
        setter={setMinExpressionLog}
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
      {searchHits.length > 0 && (
        <DatasetsTable datasets={searchHits} minGeneExpression={10 ** minExpressionLog} geneName={geneNames[0]} />
      )}
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

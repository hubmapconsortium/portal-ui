import React, { useState, useMemo, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';

import LogSliderWrapper from 'js/components/cells/LogSliderWrapper';
import CellsService from 'js/components/cells/CellsService';
import AutocompleteEntity from 'js/components/cells/AutocompleteEntity';
import { useSearchHits } from 'js/hooks/useSearchData';

import { StyledDiv } from './style';

function DatasetsSelectedByExpression({
  completeStep,
  setResults,
  minExpressionLog,
  setMinExpressionLog,
  minCellPercentage,
  setMinCellPercentage,
  cellVariableNames,
  setCellVariableNames,
  queryType,
}) {
  const [cellsResults, setCellsResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    setResults([]);
    const queryParams = {
      type: queryType,
      names: cellVariableNames,
      minExpression: 10 ** minExpressionLog,
      minCellPercentage,
    };
    if (queryType === 'gene') {
      queryParams.modality = 'rna';
    }
    try {
      completeStep(
        <>
          {cellVariableNames.join(', ')} | Expression Level 10<sup>{minExpressionLog}</sup> | {minCellPercentage}% Cell
          Percentage
        </>,
      );
      const serviceResults = await new CellsService().getDatasets(queryParams);
      setCellsResults(serviceResults);
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
                uuid: cellsResults.map((result) => result.uuid),
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
  }, [cellsResults]);

  const { searchHits } = useSearchHits(query);

  useEffect(() => {
    setResults(searchHits);
  }, [searchHits, setResults]);

  return (
    <StyledDiv>
      <AutocompleteEntity
        targetEntity={`${queryType}s`}
        setter={setCellVariableNames}
        cellVariableNames={cellVariableNames}
        setCellVariableNames={setCellVariableNames}
      />

      <br />

      <FormLabel id="min-expression-label">{`Minimum ${queryType} expression`}</FormLabel>
      <LogSliderWrapper
        value={minExpressionLog}
        minLog={-4}
        maxLog={5}
        setter={setMinExpressionLog}
        labelledby="min-expression-label"
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
    </StyledDiv>
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

import React, { useState, useContext } from 'react';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';

import LogSliderWrapper from 'js/components/cells/LogSliderWrapper';
import CellsService from 'js/components/cells/CellsService';
import AutocompleteEntity from 'js/components/cells/AutocompleteEntity';
import { AppContext } from 'js/components/Providers';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { StyledDiv, StyledTextField } from './style';

function getSearchQuery(cellsResults) {
  return {
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
      'donor',
      'last_modified_timestamp',
    ],
  };
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
  setIsLoading,
}) {
  const [message, setMessage] = useState(null);
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const [genomicModality, setGenomicModality] = useState('rna');

  function handleSelectModality(event) {
    setGenomicModality(event.target.value);
  }

  async function handleSubmit() {
    setIsLoading(true);
    setResults([]);
    const queryParams = {
      type: queryType,
      cellVariableNames,
      minExpression: 10 ** minExpressionLog,
      minCellPercentage,
    };
    if (queryType === 'gene') {
      queryParams.modality = genomicModality;
    }
    try {
      completeStep(
        <>
          {cellVariableNames.join(', ')} | Expression Level 10<sup>{minExpressionLog}</sup> | {minCellPercentage}% Cell
          Percentage
        </>,
      );
      const serviceResults = await new CellsService().getDatasets(queryParams);
      const searchResults = await fetchSearchData(getSearchQuery(serviceResults), elasticsearchEndpoint, groupsToken);
      setResults(searchResults.hits.hits);
      setIsLoading(false);
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <StyledDiv>
      <AutocompleteEntity
        targetEntity={`${queryType}s`}
        setter={setCellVariableNames}
        cellVariableNames={cellVariableNames}
        setCellVariableNames={setCellVariableNames}
      />
      {queryType === 'gene' && (
        <StyledTextField
          id="modality-select"
          label="Genomic Modaility"
          value={genomicModality}
          onChange={handleSelectModality}
          variant="outlined"
          select
          fullWidth
          SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            },
          }}
        >
          <MenuItem value="rna">rna</MenuItem>
          <MenuItem value="atac">atac</MenuItem>
        </StyledTextField>
      )}
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
        max={10}
        marks={[0, 1, 2, 5, 10]}
        setter={setMinCellPercentage}
        labelledby="min-cell-percentage-label"
      />
      <br />
      <Button onClick={handleSubmit} disabled={cellVariableNames.length === 0} variant="contained" color="primary">
        Run Query
      </Button>
      <br />
      {message}
    </StyledDiv>
  );
}

export default DatasetsSelectedByExpression;

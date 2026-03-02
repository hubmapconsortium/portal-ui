import { SearchHit } from 'js/typings/elasticsearch';
import { Dataset } from '../types';

export type WrappedCellsResultsDataset = Required<SearchHit<Dataset>>;

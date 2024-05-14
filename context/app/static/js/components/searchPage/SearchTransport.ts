import { ESTransport } from 'searchkit';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

import { fetchSearchData } from 'js/hooks/useSearchData';

export class SearchTransport extends ESTransport {
  apiUrl: string;

  groupsToken: string;

  constructor(apiUrl: string, groupsToken: string) {
    super();
    this.apiUrl = apiUrl;
    this.groupsToken = groupsToken;
  }

  search(query: SearchRequest) {
    return fetchSearchData(query, this.apiUrl, this.groupsToken);
  }
}

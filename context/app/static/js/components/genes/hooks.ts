import { useGeneOntologyDetail } from 'js/hooks/useUBKG';
import { useCallback } from 'react';
import { trackEvent } from 'js/helpers/trackers';
import { useGenePageContext } from './GenePageContext';
import { EventInfo } from '../types';

const useGeneOntology = () => {
  const { geneSymbol } = useGenePageContext();
  return useGeneOntologyDetail(geneSymbol);
};

const useGeneSymbol = () => {
  const { geneSymbolUpper } = useGenePageContext();
  const { data } = useGeneOntology();
  const approvedName = data?.approved_symbol;
  const geneSymbol = approvedName ?? geneSymbolUpper;
  return geneSymbol;
};

const useGeneDetailPageTrackingInfo = (name?: string, action?: string) => {
  const geneSymbol = useGeneSymbol();
  return {
    category: 'Gene Detail Page',
    label: name ? `${geneSymbol} ${name}` : geneSymbol,
    action,
  };
};

const useTrackGeneDetailPage = (eventInfo?: Partial<EventInfo> | (() => Partial<EventInfo>)) => {
  const geneSymbol = useGeneSymbol();
  return useCallback(() => {
    if (!eventInfo) return;

    const event = typeof eventInfo === 'function' ? eventInfo() : eventInfo;

    trackEvent({
      ...event,
      label: event?.label ? `${geneSymbol} ${event.label}` : geneSymbol,
      category: 'Gene Detail Page',
    });
  }, [eventInfo, geneSymbol]);
};

export { useGeneOntology, useGenePageContext, useGeneDetailPageTrackingInfo, useTrackGeneDetailPage, useGeneSymbol };

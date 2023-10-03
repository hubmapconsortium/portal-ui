import useSWR from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import type { SWRResponse } from 'swr';

interface TemplateTypes {
  title: string;
  description: string;
  tags: string[];
  is_multi_dataset_template: bool;
  template_format: string;
}

interface TemplatesResponse {
  message: string;
  success: boolean;
  data: Record<string, TemplateTypes>;
}

function useTemplatesAPI(templatesURL) {
  const { groupsToken } = useAppContext();

  const result = useSWR(
    [templatesURL, groupsToken],
    ([url, token]: string[]) =>
      fetcher({
        url,
        requestInit: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }),
    { fallbackData: {} },
  );

  return result;
}

function useWorkspaceTemplates(tags: string[] = []) {
  const queryParams = tags.map((tag, i) => `${i === 0 ? '' : '&'}tags=${encodeURIComponent(tag)}`).join('');

  const url = `https://user-templates-api.dev.hubmapconsortium.org/templates/jupyter_lab/?${queryParams}`;
  const result: SWRResponse<TemplatesResponse> = useTemplatesAPI(url);

  const templates = result?.data?.data ?? {};
  return { templates };
}

function useWorkspaceTemplateTags() {
  const result: SWRResponse<TemplatesResponse> = useTemplatesAPI(
    'https://user-templates-api.dev.hubmapconsortium.org/tags/',
  );

  const templates = result?.data?.data ?? {};
  return { templates };
}

export { useWorkspaceTemplates, useWorkspaceTemplateTags, TemplateTypes };

import useSWR from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';

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

function useWorkspaceTemplates() {
  const { workspacesToken } = useAppContext();

  const { data } = useSWR<TemplatesResponse>(
    ['https://user-templates-api.dev.hubmapconsortium.org/templates/jupyter_lab/', workspacesToken],
    ([url, token]: string[]) =>
      fetcher({
        url,
        requestInit: {
          headers: { 'UWS-Authorization': `Token ${token}` },
        },
      }),
    { fallbackData: {} },
  );

  const templates = data?.data ?? {};

  return { templates };
}
export { useWorkspaceTemplates };

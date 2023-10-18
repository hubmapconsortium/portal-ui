interface WorkspaceAPIFailure {
  success: false;
  message: string;
  data: undefined;
}

interface WorkspaceAPISuccess<Data> {
  success: true;
  message: string;
  data: Data;
}

type WorkspaceAPIResponse<Data> = WorkspaceAPIFailure | WorkspaceAPISuccess<Data>;

interface TemplateTypes {
  title: string;
  description: string;
  tags: string[];
  is_multi_dataset_template: boolean;
  template_format: string;
}

type TemplatesTypes = Record<string, TemplateTypes>;

type TemplatesResponse = WorkspaceAPIResponse<TemplateTypes>;

interface CreateTemplateData {
  template: string;
}

type CreateTemplatesResponse = WorkspaceAPIResponse<CreateTemplateData>;

interface CreateWorkspaceData {
  workspace: {
    id: number;
  };
}

type CreateWorkspaceResponse = WorkspaceAPIResponse<CreateWorkspaceData>;

interface CreateTemplateNotebooksTypes {
  templateKeys: string[];
  uuids: string[];
  workspaceName: string;
}

type TemplateTags = Record<string, string>;

type TemplateTagsResponse = WorkspaceAPIResponse<TemplateTags>;

export type {
  WorkspaceAPIResponse,
  TemplatesResponse,
  CreateTemplatesResponse,
  CreateWorkspaceResponse,
  TemplatesTypes,
  CreateTemplateNotebooksTypes,
  TemplateTagsResponse,
};

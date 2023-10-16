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
  is_multi_dataset_template: bool;
  template_format: string;
}

type TemplatesResponse = WorkspaceAPIResponse<Record<string, TemplateTypes>>;

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

export { TemplatesResponse, CreateTemplatesResponse, CreateWorkspaceResponse };

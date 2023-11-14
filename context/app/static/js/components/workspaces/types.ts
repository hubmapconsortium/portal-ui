import { JobStatus, JobStatusDisplayName, WorkspaceStatus } from './statusCodes';

interface Symlink {
  name: string;
  dataset_uuid?: string;
}
interface WorkspaceDetail {
  files: {
    name: string;
  }[];
  symlinks: Symlink[];
}

interface WorkspaceDetails {
  current_workspace_details: WorkspaceDetail;
  request_workspace_details: WorkspaceDetail & {
    globus_groups_token: string;
  };
}

export interface Workspace {
  id: number;
  name: string;
  status: WorkspaceStatus;
  description: string;
  disk_space: number;
  datetime_created: string;
  workspace_details: WorkspaceDetails;
  path: string;
}

interface WorkspaceJobDetail {
  message: string;
  time_left: number;
  proxy_details: {
    path: string;
    port: number;
    hostname: string;
  };
  connection_details: {
    url_path: string;
    url_domain: string;
  };
}

interface WorkspaceJobDetails {
  current_job_details: WorkspaceJobDetail;
  request_job_details: WorkspaceJobDetail;
}

export interface WorkspaceJob {
  id: number;
  workspace_id: number;
  resource_job_id: number;
  job_type: string;
  status: JobStatus;
  datetime_created: string;
  datetime_start: string;
  datetime_end: string;
  core_hours: string;
  job_details: WorkspaceJobDetails;
}

export interface WorkspaceJobWithDisplayStatus extends Omit<WorkspaceJob, 'status'> {
  status: JobStatusDisplayName;
}

export interface MergedWorkspace extends Workspace {
  jobs: WorkspaceJob[];
}

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

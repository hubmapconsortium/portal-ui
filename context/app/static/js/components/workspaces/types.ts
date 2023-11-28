import { JobStatus, JobStatusDisplayName, WorkspaceStatus } from './statusCodes';

// Once workspaces API issues are resolved. We expect the workspaces API to consistently return an object.
type WorkspaceFile = string | { name: string };
interface Symlink {
  name: string;
  dataset_uuid?: string;
}
interface CurrentWorkspaceDetail {
  files: WorkspaceFile[];
  symlinks: Symlink[];
}

interface RequestWorkspaceDetail extends CurrentWorkspaceDetail {
  globus_groups_token: string;
}

interface WorkspaceDetails {
  current_workspace_details: CurrentWorkspaceDetail;
  request_workspace_details: RequestWorkspaceDetail;
}

export interface Workspace {
  id: number;
  name: string;
  status: WorkspaceStatus;
  description: string;
  disk_space: number;
  datetime_created: string;
  workspace_details: WorkspaceDetails;
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
  path: string;
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

type WorkspaceAPIResponseWithoutData = Omit<WorkspaceAPIResponse<undefined>, 'data'>;

interface TemplateTypes {
  title: string;
  description: string;
  tags: string[];
  is_multi_dataset_template: boolean;
  template_format: string;
  is_hidden: boolean;
}

type TemplatesTypes = Record<string, TemplateTypes>;

type TemplatesResponse = WorkspaceAPIResponse<TemplatesTypes>;

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
  WorkspaceFile,
  WorkspaceAPIResponse,
  WorkspaceAPIResponseWithoutData,
  TemplatesResponse,
  CreateTemplatesResponse,
  CreateWorkspaceResponse,
  TemplatesTypes,
  CreateTemplateNotebooksTypes,
  TemplateTagsResponse,
};

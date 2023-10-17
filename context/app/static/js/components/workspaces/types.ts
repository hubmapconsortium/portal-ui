interface WorkspaceDetail {
  files: {
    name: string;
  }[];
  symlinks: {
    name: string;
  }[];
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
  status: string;
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
  status: string;
  datetime_created: string;
  datetime_start: string;
  datetime_end: string;
  core_hours: string;
  job_details: WorkspaceJobDetails;
}

export interface MergedWorkspace extends Workspace {
  jobs: WorkspaceJob[];
}

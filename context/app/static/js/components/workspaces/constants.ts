/* Workspace job types */
export const JUPYTER_LAB_JOB_TYPE = 'jupyter_lab';
export const JUPYTER_LAB_R_JOB_TYPE = 'jupyter_lab_r';
export const JUPYTER_LAB_GPU_JOB_TYPE = 'jupyter_lab_gpu_common_packages';
export const JUPYTER_LAB_NON_GPU_JOB_TYPE = 'jupyter_lab_non_gpu_common_packages';

/* Workspace defaults */
export const DEFAULT_JOB_TYPE = JUPYTER_LAB_JOB_TYPE;
export const DEFAULT_TEMPLATE_KEY = 'blank';

/* Workspace resource defaults */
export const DEFAULT_NUM_CPUS = 1;
export const DEFAULT_MEMORY_MB = 8192;
export const DEFAULT_TIME_LIMIT_MINUTES = 180;
export const DEFAULT_GPU_ENABLED = false;

/* Workspace resource limits */
export const MIN_NUM_CPUS = 1;
export const MAX_NUM_CPUS = 2;

export const MIN_MEMORY_MB = 1024;
export const MAX_MEMORY_MB = 32768;

export const MIN_TIME_LIMIT_MINUTES = 60;
export const MAX_TIME_LIMIT_MINUTES = 360;

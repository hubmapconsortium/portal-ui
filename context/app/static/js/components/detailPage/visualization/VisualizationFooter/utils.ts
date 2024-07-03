import packageInfo from 'package';

export function getVitessceVersion(): string {
  const version = packageInfo.dependencies.vitessce.replace('^', '');
  return version;
}

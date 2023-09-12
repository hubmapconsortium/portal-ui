export interface VignetteFigure {
  file: string;
  name: string;
}

export interface PublicationVignette {
  name: string;
  description: string;
  figures?: VignetteFigure[];
  directory_name: string;
}

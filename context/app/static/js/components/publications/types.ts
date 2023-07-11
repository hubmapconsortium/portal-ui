export type VignetteFigure = {
  file: string;
  name: string;
};

export type PublicationVignette = {
  name: string;
  description: string;
  figures?: VignetteFigure[];
  directory_name: string;
};

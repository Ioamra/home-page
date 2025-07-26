export interface ObjectPostMan {
  info: InfoPM;
  item: FolderItemPM[];
  variable: VariableEnvPM[];
}

export interface ItemPM {
  name: string;
  event?: { listen: string; script: { exec: string[]; type: string; packages: unknown } }[];
  request: RequestPM;
}

export interface FolderItemPM {
  name: string;
  item: ItemPM[];
  description?: string;
}

interface InfoPM {
  name: 'HomePage';
  description: string;
  schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';
}

interface HeaderRequestPM {
  key: string;
  value: string;
  type: string;
}

interface UrlRequestPM {
  raw: string;
  host: string[];
  path: string[];
}

interface BodyRequestPM {
  mode: 'raw';
  raw: string;
  options: {
    raw: {
      language: 'json';
    };
  };
}

interface RequestPM {
  method: string;
  header: HeaderRequestPM[];
  body?: BodyRequestPM;
  url: UrlRequestPM;
}

interface VariableEnvPM {
  key: string;
  value: string;
  type: string;
}
